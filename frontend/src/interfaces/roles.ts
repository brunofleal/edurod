export const Role = {
    ADMIN: "admin",
    OPENER: "opener",
    CLOSER: "closer",
    VIEWER: "viewer",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
