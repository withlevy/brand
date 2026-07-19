export interface TierInfo {
    key: string;
    level: number;
    uid: string | null;
    label: string;
}

export const TIER_MAP: Record<string, TierInfo> = {
    architect: { key: 'architect', level: 4, uid: 'LmJ47j9P', label: 'Architect' },
    builder:   { key: 'builder',   level: 3, uid: 'rmk5w09g', label: 'Builder' },
    insider:   { key: 'insider',   level: 2, uid: 'Nmdndw90', label: 'Insider' },
    free:      { key: 'free',      level: 1, uid: 'MQvb4oQY', label: 'Free' },
    public:    { key: 'public',    level: 0, uid: null,        label: 'Public' },
};

const PUBLIC_TIER = TIER_MAP.public;

/**
 * Scan RSS categories for a tier keyword. Returns the highest-level match,
 * defaulting to "public" if no tier tag is found.
 */
export function getTierFromCategories(categories: string[]): TierInfo {
    let best = PUBLIC_TIER;
    for (const cat of categories) {
        const key = cat.trim().toLowerCase();
        const match = TIER_MAP[key];
        if (match && match.level > best.level) {
            best = match;
        }
    }
    return best;
}

/**
 * Map an Outseta Plan UID to a numeric tier level.
 * Returns 0 (public) if the UID is unrecognized or null.
 */
export function getLevelFromPlanUid(uid: string | null | undefined): number {
    if (!uid) return 0;
    for (const tier of Object.values(TIER_MAP)) {
        if (tier.uid === uid) return tier.level;
    }
    return 0;
}

/**
 * Get the TierInfo for a given tier key (e.g., "builder").
 */
export function getTierByKey(key: string): TierInfo {
    return TIER_MAP[key.toLowerCase()] ?? PUBLIC_TIER;
}
