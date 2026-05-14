# ModPilot

ModPilot is a Devvit-powered moderation assistant that helps Reddit moderators reduce queue overload by automatically triaging posts and comments.

## Overview

Moderators spend significant time manually reviewing spam, scams, harassment, toxic comments, low-effort posts, and repeated rule violations.

ModPilot reduces moderation workload by:

* Scanning Reddit posts and comments in real time
* Assigning risk levels
* Explaining likely rule violations
* Suggesting moderation actions
* Providing a centralized moderation dashboard

## Features

### Real-Time Post Scanning

Uses Devvit `onPostSubmit` triggers to analyze new Reddit posts.

### Real-Time Comment Scanning

Uses Devvit `onCommentSubmit` triggers to scan comments for suspicious content.

### Risk Classification

Each item is classified as:

* HIGH Risk
* MEDIUM Risk
* LOW Risk

### Spam & Scam Detection

Detects:

* Telegram solicitation
* DM scams
* Crypto giveaways
* Off-platform promotions
* Suspicious self-promotion

### Harassment Detection

Flags:

* Toxic language
* Personal attacks
* Harassment phrases

### Low-Effort Content Detection

Detects short or low-context posts/comments.

### Rule-Based Moderation Explanations

Each flagged item includes:

* Reason for flagging
* Suggested moderator action
* Rule category context

### Moderation Dashboard

Dashboard includes:

* Flagged posts
* Flagged comments
* Moderation queue
* Risk indicators
* Moderator actions
* Moderation analytics

### Moderator Actions

Moderators can:

* Mark Reviewed
* Ignore
* Remove Post
* Open original content

### Moderation Analytics

Tracks:

* Total flagged content
* High-risk items
* Removed items
* Open moderation queue
* Estimated moderator time saved

## Tech Stack

* Reddit Devvit
* TypeScript
* React
* Hono
* TailwindCSS

## Project Structure

```txt
src/
 ├── client/
 │    ├── splash.tsx
 │
 ├── server/
 │    ├── routes/
 │    │    ├── api.ts
 │    │    ├── menu.ts
 │    │    ├── triggers.ts
 │    │
 │    ├── core/
 │         ├── modpilotStore.ts
 │         ├── post.ts
```

## Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/modpilot-devvit.git
cd modpilot-devvit
```

### Install Dependencies

```bash
npm install
```

### Login to Devvit

```bash
npx devvit login
```

### Start Playtest

```bash
npm run dev
```

or:

```bash
devvit playtest
```

## Example Workflow

### Example Suspicious Post

```txt
Title: Free crypto giveaway
Body: DM me on Telegram
```

### ModPilot Result

* HIGH Risk
* Spam / Self-Promotion detected
* Suggested Action: Remove immediately

## Dashboard Workflow

1. User submits suspicious post/comment
2. Devvit trigger analyzes content
3. ModPilot flags risky content
4. Dashboard updates moderation queue
5. Moderator reviews item
6. Moderator reviews/removes/ignores content

## Why ModPilot Stands Out

Most moderation bots only remove content based on static keyword matching.

ModPilot focuses on:

* Moderation triage
* Explainability
* Human-in-the-loop moderation
* Queue prioritization
* Moderator workflow efficiency

## Future Improvements

* AI moderation scoring
* Auto-moderation policies
* Moderator collaboration notes
* User reputation scoring
* Queue filtering and search
* Cross-community analytics
* ML-based toxicity scoring

## Demo Flow

1. Open ModPilot dashboard
2. Submit suspicious Reddit post
3. Devvit trigger scans content
4. Dashboard updates with HIGH-risk item
5. Moderator reviews explanation
6. Moderator removes or reviews content
7. Submit suspicious comment
8. Dashboard updates with flagged comment
9. Analytics update automatically

## developers.reddit.com app page

Add your Devvit app link here.

## Demo Video

Add your demo video link here.

---

## Devvit React Starter

A starter to build web applications on Reddit's developer platform

- [Devvit](https://developers.reddit.com/): A way to build and deploy immersive games on Reddit
- [Vite](https://vite.dev/): For compiling the webView
- [React](https://react.dev/): For UI
- [Hono](https://hono.dev/): For backend logic
- [Tailwind](https://tailwindcss.com/): For styles
- [TypeScript](https://www.typescriptlang.org/): For type safety

## Getting Started

> Make sure you have Node 22 downloaded on your machine before running!

1. Run `npm create devvit@latest --template=react`
2. Go through the installation wizard. You will need to create a Reddit account and connect it to Reddit developers
3. Copy the command on the success page into your terminal

## Commands

- `npm run dev`: Starts a development server where you can develop your application live on Reddit.
- `npm run build`: Builds your client and server projects
- `npm run deploy`: Uploads a new version of your app
- `npm run launch`: Publishes your app for review
- `npm run login`: Logs your CLI into Reddit
- `npm run type-check`: Type checks, lints, and prettifies your app
