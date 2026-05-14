import { Hono } from 'hono';
import type { OnAppInstallRequest, TriggerResponse } from '@devvit/web/shared';
import { context } from '@devvit/web/server';
import { createPost } from '../core/post';

import {
  flaggedPosts,
  flaggedComments,
  type FlaggedPost,
  type FlaggedComment,
  type RiskLevel,
} from '../core/modpilotStore';

export const triggers = new Hono();

function classifyContent(title: string, body: string) {
  const text = `${title} ${body}`.toLowerCase();

  let risk: RiskLevel = 'LOW';
  let reason = 'No obvious issue detected.';
  let suggestedAction = 'No action needed.';

  if (
    text.includes('free crypto') ||
    text.includes('telegram') ||
    text.includes('dm me') ||
    text.includes('giveaway') ||
    text.includes('buy now') ||
    text.includes('cashapp') ||
    text.includes('whatsapp') ||
    text.includes('onlyfans')
  ) {
    risk = 'HIGH';
    reason =
      'Likely Rule Violation: Spam / Self-Promotion. The content contains promotional or off-platform contact language such as “DM me,” “Telegram,” “giveaway,” or similar scam patterns.';
    suggestedAction =
      'Remove the content or review immediately before it reaches more users.';
  } else if (
    text.includes('idiot') ||
    text.includes('stupid') ||
    text.includes('shut up') ||
    text.includes('kill yourself')
  ) {
    risk = 'HIGH';
    reason =
      'Likely Rule Violation: Harassment / Personal Attack. The content contains insulting, hostile, or harmful language toward another user.';
    suggestedAction =
      'Review immediately. Remove if it violates the community harassment rule.';
  } else if (text.length > 0 && text.length < 40) {
    risk = 'MEDIUM';
    reason =
      'Possible Rule Violation: Low-Effort Content. The content is very short and may not provide enough context for meaningful discussion.';
    suggestedAction =
      'Review when available. Ask the user to add more details if needed.';
  }

  return { risk, reason, suggestedAction };
}

triggers.post('/on-app-install', async (c) => {
  try {
    const post = await createPost();
    const input = await c.req.json<OnAppInstallRequest>();

    return c.json<TriggerResponse>(
      {
        status: 'success',
        message: `Post created in subreddit ${context.subredditName} with id ${post.id} (trigger: ${input.type})`,
      },
      200
    );
  } catch (error) {
    console.error(`Error creating post: ${error}`);

    return c.json<TriggerResponse>(
      {
        status: 'error',
        message: 'Failed to create post',
      },
      400
    );
  }
});

triggers.post('/on-post-submit', async (c) => {
  try {
    const input = await c.req.json();
    const post = input.post;

    const title = post?.title ?? '';
    const body = post?.selftext ?? '';
    const { risk, reason, suggestedAction } = classifyContent(title, body);

    const result: FlaggedPost = {
      postId: post?.id ?? '',
      title,
      body,
      risk,
      reason,
      suggestedAction,
      permalink: post?.permalink ?? '',
      createdAt: new Date().toISOString(),
      status: 'OPEN',
    };

    console.log('ModPilot classified new post');
    console.log(result);

    if (risk !== 'LOW') {
      flaggedPosts.unshift(result);
      console.log('Saved flagged post to ModPilot queue');
    }

    return c.json<TriggerResponse>(
      {
        status: 'success',
        message: `Post classified as ${risk}`,
      },
      200
    );
  } catch (error) {
    console.error(`Error handling post submit: ${error}`);

    return c.json<TriggerResponse>(
      {
        status: 'error',
        message: 'Failed to handle post submit',
      },
      400
    );
  }
});

triggers.post('/on-comment-submit', async (c) => {
  try {
    const input = await c.req.json();
    const comment = input.comment;

    const body = comment?.body ?? '';
    const { risk, reason, suggestedAction } = classifyContent('', body);

    const result: FlaggedComment = {
      commentId: comment?.id ?? '',
      body,
      risk,
      reason,
      suggestedAction,
      permalink: comment?.permalink ?? '',
      createdAt: new Date().toISOString(),
      status: 'OPEN',
    };

    console.log('ModPilot classified new comment');
    console.log(result);

    if (risk !== 'LOW') {
      flaggedComments.unshift(result);
      console.log('Saved flagged comment to ModPilot queue');
    }

    return c.json<TriggerResponse>(
      {
        status: 'success',
        message: `Comment classified as ${risk}`,
      },
      200
    );
  } catch (error) {
    console.error(`Error handling comment submit: ${error}`);

    return c.json<TriggerResponse>(
      {
        status: 'error',
        message: 'Failed to handle comment submit',
      },
      400
    );
  }
});