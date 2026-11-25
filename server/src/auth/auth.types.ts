export type SafeUser = { id: string; email: string; displayName: string; createdAt: Date; profile?: { preferredAvatar: string; publicProfile: boolean } | null };
export type AuthenticatedRequestUser = { id: string; email: string; displayName: string; createdAt: Date };
