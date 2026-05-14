export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ReviewStatus = 'OPEN' | 'REVIEWED' | 'IGNORED' | 'REMOVED';

export type FlaggedPost = {
  postId: string;
  title: string;
  body: string;
  risk: RiskLevel;
  reason: string;
  suggestedAction: string;
  permalink: string;
  createdAt: string;
  status: ReviewStatus;
};

export type FlaggedComment = {
  commentId: string;
  body: string;
  risk: RiskLevel;
  reason: string;
  suggestedAction: string;
  permalink: string;
  createdAt: string;
  status: ReviewStatus;
};

const globalStore = globalThis as unknown as {
  modPilotFlaggedPosts?: FlaggedPost[];
  modPilotFlaggedComments?: FlaggedComment[];
};

export const flaggedPosts =
  globalStore.modPilotFlaggedPosts ?? (globalStore.modPilotFlaggedPosts = []);

export const flaggedComments =
  globalStore.modPilotFlaggedComments ??
  (globalStore.modPilotFlaggedComments = []);