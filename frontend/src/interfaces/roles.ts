export const Role = {
    ADMIN: "admin",
    OPENER: "opener",
    CLOSER: "closer",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
