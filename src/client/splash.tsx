import './index.css';

import { navigateTo } from '@devvit/web/client';
import { context } from '@devvit/web/client';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
type ReviewStatus = 'OPEN' | 'REVIEWED' | 'IGNORED' | 'REMOVED';

type FlaggedPost = {
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

type FlaggedComment = {
  commentId: string;
  body: string;
  risk: RiskLevel;
  reason: string;
  suggestedAction: string;
  permalink: string;
  createdAt: string;
  status: ReviewStatus;
};

type Stats = {
  totalFlagged: number;
  totalFlaggedPosts: number;
  totalFlaggedComments: number;
  highRisk: number;
  mediumRisk: number;
  open: number;
  reviewed: number;
  ignored: number;
  removed: number;
  estimatedMinutesSaved: number;
};

export const Splash = () => {
  const [flaggedPosts, setFlaggedPosts] = useState<FlaggedPost[]>([]);
  const [flaggedComments, setFlaggedComments] = useState<FlaggedComment[]>([]);

  const [stats, setStats] = useState<Stats>({
    totalFlagged: 0,
    totalFlaggedPosts: 0,
    totalFlaggedComments: 0,
    highRisk: 0,
    mediumRisk: 0,
    open: 0,
    reviewed: 0,
    ignored: 0,
    removed: 0,
    estimatedMinutesSaved: 0,
  });

  const loadDashboard = async () => {
  try {
    const flaggedPostResponse = await fetch('/api/flagged-posts');
    const flaggedPostData = await flaggedPostResponse.json();

    const flaggedCommentResponse = await fetch('/api/flagged-comments');
    const flaggedCommentData = await flaggedCommentResponse.json();

    const statsResponse = await fetch('/api/stats');
    const statsData = await statsResponse.json();

    setFlaggedPosts(flaggedPostData.flaggedPosts ?? []);
    setFlaggedComments(flaggedCommentData.flaggedComments ?? []);
    setStats(statsData.stats);
  } catch (error) {
    console.error('Failed to load ModPilot dashboard', error);
  }
};

const markPostReviewed = async (postId: string) => {
  await fetch('/api/mark-reviewed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId }),
  });

  await loadDashboard();
};

const ignorePost = async (postId: string) => {
  await fetch('/api/ignore-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId }),
  });

  await loadDashboard();
};

const removePost = async (postId: string) => {
  await fetch('/api/remove-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId }),
  });

  await loadDashboard();
};

const markCommentReviewed = async (commentId: string) => {
  await fetch('/api/mark-comment-reviewed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commentId }),
  });

  await loadDashboard();
};

const ignoreComment = async (commentId: string) => {
  await fetch('/api/ignore-comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commentId }),
  });

  await loadDashboard();
};
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm text-orange-400 font-semibold">
            Devvit Moderation App
          </p>

          <h1 className="text-4xl font-bold">ModPilot Dashboard</h1>

          <p className="text-gray-300">
            Smart queue triage for r/{context.subredditName ?? 'your subreddit'}.
            ModPilot flags high-risk posts and comments, explains likely rule
            violations, and helps moderators review faster.
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
            <p className="text-gray-400 text-sm">Total Flagged</p>
            <p className="text-3xl font-bold">{stats.totalFlagged}</p>
          </div>

          <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
            <p className="text-gray-400 text-sm">Posts Flagged</p>
            <p className="text-3xl font-bold">{stats.totalFlaggedPosts}</p>
          </div>

          <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
            <p className="text-gray-400 text-sm">Comments Flagged</p>
            <p className="text-3xl font-bold">{stats.totalFlaggedComments}</p>
          </div>

          <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
            <p className="text-gray-400 text-sm">Minutes Saved</p>
            <p className="text-3xl font-bold text-green-400">
              {stats.estimatedMinutesSaved}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
            <p className="text-gray-400 text-sm">High Risk</p>
            <p className="text-3xl font-bold text-red-400">{stats.highRisk}</p>
          </div>

          <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
            <p className="text-gray-400 text-sm">Medium Risk</p>
            <p className="text-3xl font-bold text-yellow-300">
              {stats.mediumRisk}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
            <p className="text-gray-400 text-sm">Open</p>
            <p className="text-3xl font-bold">{stats.open}</p>
          </div>

          <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
            <p className="text-gray-400 text-sm">Removed</p>
            <p className="text-3xl font-bold text-orange-400">
              {stats.removed}
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-gray-900 border border-gray-800 p-5">
          <div className="flex justify-between items-center mb-4 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Flagged Posts</h2>
              <p className="text-gray-400 text-sm">
                Posts classified as medium or high risk.
              </p>
            </div>

            <button
              onClick={loadDashboard}
              className="rounded-full bg-orange-600 hover:bg-orange-700 px-4 py-2 text-sm font-semibold"
            >
              Refresh
            </button>
          </div>

          {flaggedPosts.length === 0 ? (
            <div className="rounded-xl bg-gray-950 border border-gray-800 p-6 text-gray-400">
              No flagged posts yet. Create a test post like “Free crypto
              giveaway” to see ModPilot classify it.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {flaggedPosts.map((post) => (
                <div
                  key={post.postId}
                  className="rounded-xl bg-gray-950 border border-gray-800 p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={
                        post.risk === 'HIGH'
                          ? 'rounded-full bg-red-900 text-red-200 px-3 py-1 text-xs font-bold'
                          : 'rounded-full bg-yellow-900 text-yellow-200 px-3 py-1 text-xs font-bold'
                      }
                    >
                      {post.risk}
                    </span>

                    <span className="rounded-full bg-gray-800 text-gray-300 px-3 py-1 text-xs">
                      {post.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <p className="text-gray-400 text-sm">{post.body}</p>

                  <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                    <p className="text-sm text-gray-400">Reason</p>
                    <p>{post.reason}</p>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                    <p className="text-sm text-gray-400">Suggested Action</p>
                    <p>{post.suggestedAction}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => markPostReviewed(post.postId)}
                      className="rounded-full bg-green-700 hover:bg-green-800 px-4 py-2 text-sm font-semibold"
                    >
                      Mark Reviewed
                    </button>

                    <button
                      onClick={() => ignorePost(post.postId)}
                      className="rounded-full bg-gray-700 hover:bg-gray-800 px-4 py-2 text-sm font-semibold"
                    >
                      Ignore
                    </button>

                    <button
                      onClick={() => removePost(post.postId)}
                      className="rounded-full bg-red-700 hover:bg-red-800 px-4 py-2 text-sm font-semibold"
                    >
                      Remove Post
                    </button>

                    <button
                      onClick={() =>
                        navigateTo(`https://reddit.com${post.permalink}`)
                      }
                      className="rounded-full bg-orange-600 hover:bg-orange-700 px-4 py-2 text-sm font-semibold"
                    >
                      Open Post
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-gray-900 border border-gray-800 p-5">
          <div className="flex justify-between items-center mb-4 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Flagged Comments</h2>
              <p className="text-gray-400 text-sm">
                Comments classified as medium or high risk.
              </p>
            </div>

            <button
              onClick={loadDashboard}
              className="rounded-full bg-orange-600 hover:bg-orange-700 px-4 py-2 text-sm font-semibold"
            >
              Refresh
            </button>
          </div>

          {flaggedComments.length === 0 ? (
            <div className="rounded-xl bg-gray-950 border border-gray-800 p-6 text-gray-400">
              No flagged comments yet. Add a test comment like “DM me on
              Telegram for free crypto.”
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {flaggedComments.map((comment) => (
                <div
                  key={comment.commentId}
                  className="rounded-xl bg-gray-950 border border-gray-800 p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={
                        comment.risk === 'HIGH'
                          ? 'rounded-full bg-red-900 text-red-200 px-3 py-1 text-xs font-bold'
                          : 'rounded-full bg-yellow-900 text-yellow-200 px-3 py-1 text-xs font-bold'
                      }
                    >
                      {comment.risk}
                    </span>

                    <span className="rounded-full bg-gray-800 text-gray-300 px-3 py-1 text-xs">
                      {comment.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold">Flagged Comment</h3>
                  <p className="text-gray-400 text-sm">{comment.body}</p>

                  <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                    <p className="text-sm text-gray-400">Reason</p>
                    <p>{comment.reason}</p>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                    <p className="text-sm text-gray-400">Suggested Action</p>
                    <p>{comment.suggestedAction}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => markCommentReviewed(comment.commentId)}
                      className="rounded-full bg-green-700 hover:bg-green-800 px-4 py-2 text-sm font-semibold"
                    >
                      Mark Reviewed
                    </button>

                    <button
                      onClick={() => ignoreComment(comment.commentId)}
                      className="rounded-full bg-gray-700 hover:bg-gray-800 px-4 py-2 text-sm font-semibold"
                    >
                      Ignore
                    </button>

                    <button
                      onClick={() =>
                        navigateTo(`https://reddit.com${comment.permalink}`)
                      }
                      className="rounded-full bg-orange-600 hover:bg-orange-700 px-4 py-2 text-sm font-semibold"
                    >
                      Open Comment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);