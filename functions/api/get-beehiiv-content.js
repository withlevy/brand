/**
 * Cloudflare Pages Function: GET /api/get-beehiiv-content
 *
 * Waterfall Content Gate — secure backend for gated Beehiiv content.
 * Validates Outseta JWT, checks tier access, and returns post HTML.
 *
 * Environment variables (set in Cloudflare Pages dashboard):
 *   - BEEHIIV_API_KEY: Beehiiv API bearer token
 *   - BEEHIIV_PUBLICATION_ID: Beehiiv publication ID
 *   - OUTSETA_API_SECRET: Outseta API secret (Base64-encoded) for server-side token verification
 */

const TIER_MAP = {
    architect: { level: 4, uid: 'LmJ47j9P', label: 'Architect' },
    builder:   { level: 3, uid: 'rmk5w09g', label: 'Builder' },
    insider:   { level: 2, uid: 'Nmdndw90', label: 'Insider' },
    free:      { level: 1, uid: 'MQvb4oQY', label: 'Free' },
    public:    { level: 0, uid: null,        label: 'Public' },
};

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
}

function getLevelFromPlanUid(uid) {
    if (!uid) return 0;
    for (const tier of Object.values(TIER_MAP)) {
        if (tier.uid === uid) return tier.level;
    }
    return 0;
}

function getTierFromTags(tags) {
    let best = TIER_MAP.public;
    if (!tags || !Array.isArray(tags)) return best;
    for (const tag of tags) {
        const key = (typeof tag === 'string' ? tag : tag?.name || '').trim().toLowerCase();
        const match = TIER_MAP[key];
        if (match && match.level > best.level) {
            best = match;
        }
    }
    return best;
}

/**
 * Decode a Base64URL string to a Uint8Array.
 */
function base64UrlDecode(str) {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

/**
 * Verify an Outseta JWT using the OUTSETA_API_SECRET (HMAC-SHA256).
 * Returns the decoded payload or null if verification fails.
 */
async function verifyOutsetaToken(accessToken, apiSecret) {
    try {
        const parts = accessToken.split('.');
        if (parts.length !== 3) return null;

        const [headerB64, payloadB64, signatureB64] = parts;

        // Import the secret as an HMAC key
        const keyData = base64UrlDecode(apiSecret);
        const key = await crypto.subtle.importKey(
            'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
        );

        // Verify the signature against header.payload
        const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
        const signature = base64UrlDecode(signatureB64);
        const valid = await crypto.subtle.verify('HMAC', key, signature, data);

        if (!valid) return null;

        // Decode and parse the payload
        const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));

        // Check expiration
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

        return payload;
    } catch {
        return null;
    }
}

/**
 * Fetch the full Outseta user profile using the API secret for server-to-server auth.
 * Uses the person UID from the verified JWT to look up subscription details.
 */
async function fetchOutsetaProfile(personUid, apiSecret) {
    const res = await fetch(`https://levy.outseta.com/api/v1/crm/people/${personUid}?fields=Account.CurrentSubscription.Plan.Uid`, {
        headers: {
            'Authorization': `Outseta ${apiSecret}`,
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) return null;
    return res.json();
}

/**
 * Fetch a Beehiiv post by slug.
 */
async function fetchBeehiivPost(slug, apiKey, publicationId) {
    const url = `https://api.beehiiv.com/v2/publications/${publicationId}/posts?slug=${encodeURIComponent(slug)}&expand=free_web_content,premium_web_content`;
    const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.[0] || null;
}

export async function onRequestOptions() {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
    const { env, request } = context;

    // Parse request body
    let body;
    try {
        body = await request.json();
    } catch {
        return jsonResponse({ error: 'invalid_body', message: 'Expected JSON body with { slug }.' }, 400);
    }

    const { slug } = body;
    if (!slug || typeof slug !== 'string') {
        return jsonResponse({ error: 'missing_slug', message: 'A "slug" field is required.' }, 400);
    }

    // Validate environment
    const apiKey = env.BEEHIIV_API_KEY;
    const pubId = env.BEEHIIV_PUBLICATION_ID;
    const outsetaSecret = env.OUTSETA_API_SECRET;
    if (!apiKey || !pubId || !outsetaSecret) {
        return jsonResponse({ error: 'server_config', message: 'Server misconfiguration.' }, 500);
    }

    // Fetch the Beehiiv post to determine its required tier
    const post = await fetchBeehiivPost(slug, apiKey, pubId);
    if (!post) {
        return jsonResponse({ error: 'not_found', message: 'Post not found.' }, 404);
    }

    // Determine the post's required tier from its tags
    const postTags = post.content_tags || post.tags || [];
    const requiredTier = getTierFromTags(postTags);

    // For public posts, return content without auth check
    if (requiredTier.level === 0) {
        const html = post.content?.free?.web || post.content?.premium?.web || '';
        return jsonResponse({ html, tier: requiredTier });
    }

    // Extract and validate the Outseta access token
    const authHeader = request.headers.get('Authorization') || '';
    const accessToken = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!accessToken) {
        return jsonResponse({
            error: 'auth_required',
            message: 'Authentication required to access this content.',
            requiredTier: requiredTier.label,
            requiredUid: requiredTier.uid,
        }, 401);
    }

    // Verify the JWT signature using OUTSETA_API_SECRET (HMAC-SHA256)
    const tokenPayload = await verifyOutsetaToken(accessToken, outsetaSecret);
    if (!tokenPayload) {
        return jsonResponse({
            error: 'invalid_token',
            message: 'Invalid or expired access token.',
        }, 401);
    }

    // Fetch user profile from Outseta using the API secret for server-to-server auth
    const personUid = tokenPayload.sub || tokenPayload.nameid;
    if (!personUid) {
        return jsonResponse({
            error: 'invalid_token',
            message: 'Token missing user identifier.',
        }, 401);
    }

    const profile = await fetchOutsetaProfile(personUid, outsetaSecret);
    if (!profile) {
        return jsonResponse({
            error: 'profile_error',
            message: 'Unable to retrieve user profile.',
        }, 500);
    }

    // Determine user's tier level from their subscription plan
    const planUid = profile?.Account?.CurrentSubscription?.Plan?.Uid || null;
    const userLevel = getLevelFromPlanUid(planUid);

    // Authorization check: user level must meet or exceed post level
    if (userLevel < requiredTier.level) {
        return jsonResponse({
            error: 'upgrade_required',
            message: `This content requires ${requiredTier.label} tier or above.`,
            requiredTier: requiredTier.label,
            requiredUid: requiredTier.uid,
            userLevel,
        }, 403);
    }

    // Authorized — return the full post HTML
    const html = post.content?.free?.web || post.content?.premium?.web || '';

    return jsonResponse({ html, tier: requiredTier });
}
