import { Hono } from 'hono';
import { context, redis, reddit } from '@devvit/web/server';
import type {
  DecrementResponse,
  IncrementResponse,
  InitResponse,
} from '../../shared/api';

import {
  flaggedPosts,
  flaggedComments,
} from '../core/modpilotStore';

type ErrorResponse = {
  status: 'error';
  message: string;
};

export const api = new Hono();

api.get('/init', async (c) => {
  const { postId } = context;

  if (!postId) {
    console.error('API Init Error: postId not found in devvit context');
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required but missing from context',
      },
      400
    );
  }

  try {
    const [count, username] = await Promise.all([
      redis.get('count'),
      reddit.getCurrentUsername(),
    ]);

    return c.json<InitResponse>({
      type: 'init',
      postId: postId,
      count: count ? parseInt(count) : 0,
      username: username ?? 'anonymous',
    });
  } catch (error) {
    console.error(`API Init Error for post ${postId}:`, error);

    let errorMessage = 'Unknown error during initialization';
    if (error instanceof Error) {
      errorMessage = `Initialization failed: ${error.message}`;
    }

    return c.json<ErrorResponse>(
      { status: 'error', message: errorMessage },
      400
    );
  }
});

api.post('/increment', async (c) => {
  const { postId } = context;

  if (!postId) {
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required',
      },
      400
    );
  }

  const count = await redis.incrBy('count', 1);

  return c.json<IncrementResponse>({
    count,
    postId,
    type: 'increment',
  });
});

api.post('/decrement', async (c) => {
  const { postId } = context;

  if (!postId) {
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required',
      },
      400
    );
  }

  const count = await redis.incrBy('count', -1);

  return c.json<DecrementResponse>({
    count,
    postId,
    type: 'decrement',
  });
});

// =========================
// MODPILOT DASHBOARD API
// =========================

api.get('/flagged-posts', async (c) => {
  return c.json({
    status: 'success',
    count: flaggedPosts.length,
    flaggedPosts,
  });
});

api.get('/flagged-comments', async (c) => {
  return c.json({
    status: 'success',
    count: flaggedComments.length,
    flaggedComments,
  });
});

api.post('/mark-reviewed', async (c) => {
  const input = await c.req.json();
  const postId = input.postId;

  const item = flaggedPosts.find((post) => post.postId === postId);

  if (!item) {
    return c.json({ status: 'error', message: 'Post not found' }, 404);
  }

  item.status = 'REVIEWED';

  return c.json({
    status: 'success',
    message: 'Post marked as reviewed',
    item,
  });
});

api.post('/ignore-post', async (c) => {
  const input = await c.req.json();
  const postId = input.postId;

  const item = flaggedPosts.find((post) => post.postId === postId);

  if (!item) {
    return c.json({ status: 'error', message: 'Post not found' }, 404);
  }

  item.status = 'IGNORED';

  return c.json({
    status: 'success',
    message: 'Post ignored',
    item,
  });
});

api.post('/remove-post', async (c) => {
  const input = await c.req.json();
  const postId = input.postId;

  const item = flaggedPosts.find((post) => post.postId === postId);

  if (!item) {
    return c.json({ status: 'error', message: 'Post not found' }, 404);
  }

  const post = await reddit.getPostById(postId);
  if (post) {
    await post.remove(false);
  }
  item.status = 'REMOVED';
  item.suggestedAction = 'Marked removed in ModPilot demo workflow.';

  console.log(`ModPilot remove action triggered for post ${postId}`);

  return c.json({
    status: 'success',
    message: 'Post marked as removed',
    item,
  });
});

api.post('/mark-comment-reviewed', async (c) => {
  const input = await c.req.json();
  const commentId = input.commentId;

  const item = flaggedComments.find(
    (comment) => comment.commentId === commentId
  );

  if (!item) {
    return c.json({ status: 'error', message: 'Comment not found' }, 404);
  }

  item.status = 'REVIEWED';

  return c.json({
    status: 'success',
    message: 'Comment marked as reviewed',
    item,
  });
});

api.post('/ignore-comment', async (c) => {
  const input = await c.req.json();
  const commentId = input.commentId;

  const item = flaggedComments.find(
    (comment) => comment.commentId === commentId
  );

  if (!item) {
    return c.json({ status: 'error', message: 'Comment not found' }, 404);
  }

  item.status = 'IGNORED';

  return c.json({
    status: 'success',
    message: 'Comment ignored',
    item,
  });
});

api.get('/stats', async (c) => {
  const allItems = [...flaggedPosts, ...flaggedComments];

  return c.json({
    status: 'success',
    stats: {
      totalFlagged: allItems.length,
      totalFlaggedPosts: flaggedPosts.length,
      totalFlaggedComments: flaggedComments.length,
      highRisk: allItems.filter((item) => item.risk === 'HIGH').length,
      mediumRisk: allItems.filter((item) => item.risk === 'MEDIUM').length,
      open: allItems.filter((item) => item.status === 'OPEN').length,
      reviewed: allItems.filter((item) => item.status === 'REVIEWED').length,
      ignored: allItems.filter((item) => item.status === 'IGNORED').length,
      removed: allItems.filter((item) => item.status === 'REMOVED').length,
      estimatedMinutesSaved: allItems.length * 2,
    },
  });
});