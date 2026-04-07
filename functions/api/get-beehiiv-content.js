/**
 * Cloudflare Pages Function: GET /api/get-beehiiv-content
 *
 * Waterfall Content Gate — secure backend for gated Beehiiv content.
 * Validates Outseta JWT, checks tier access, and returns post HTML.
 *
 * Environment variables (set in Cloudflare Pages dashboard):
 *   - BEEHIIV_API_KEY: Beehiiv API bearer token
 *   - BEEHIIV_PUBLICATION_ID: Beehiiv publication ID
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
 * Validate the Outseta access token by calling their profile API.
 * Returns the user's account object or null if invalid.
 */
async function validateOutsetaToken(accessToken) {
    const res = await fetch('https://levy.outseta.com/api/v1/profile', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
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
    if (!apiKey || !pubId) {
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

    // Validate token with Outseta
    const profile = await validateOutsetaToken(accessToken);
    if (!profile) {
        return jsonResponse({
            error: 'invalid_token',
            message: 'Invalid or expired access token.',
        }, 401);
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
