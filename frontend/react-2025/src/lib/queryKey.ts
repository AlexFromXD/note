// src/lib/queryKeys.ts
export const queryKeys = {
  // get dms
  dms: (userId: string) => ['dms', userId] as const,
  dmMessages: (dmId: string) => ['dmMessages', dmId] as const,
}
