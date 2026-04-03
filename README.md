# Inkwell — Words Worth Reading

> An independent publishing platform for thoughtful writing. Built with React, Appwrite, and a deep respect for typography.

<img width="1027" height="555" alt="inkwell" src="https://github.com/user-attachments/assets/65fa7258-f308-436c-96df-1c8950f1e792" />


---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Pages](#pages)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Inkwell is a full-stack blogging and publishing platform built as a React learning project. It lets writers create, publish, and manage articles with a rich text editor, featured images, and a clean reading experience. The backend is fully powered by Appwrite — handling authentication, database, and file storage without a custom server.

The design philosophy is editorial-first: large serif typography, intentional whitespace, and a warm paper-toned palette inspired by independent literary magazines.

---

## Live Demo

**[inkwell.vercel.app](https://inkwell-omega-silk.vercel.app/)**

---

## Features

### Authentication
- Sign up and log in with email and password via Appwrite Auth
- Protected routes — unauthenticated users are redirected automatically
- Persistent sessions using Appwrite's session management
- Password visibility toggle on login and signup forms

### Posts
- Create, edit, and delete posts with a full rich text editor (TinyMCE)
- Auto-generated URL slugs from post titles (trimmed to 36 characters, URL-safe)
- Featured image upload stored in Appwrite Storage
- Draft / Active status toggle — publish when ready
- "Unsaved changes" indicator on the edit form

### Homepage
- Full-viewport hero section with animated headline
- **Quote of the Day** — fetches a fresh quote from [quotable.io](https://quotable.io) on every page load, with a curated fallback list
- **Featured Post** — randomly selected from your posts on every visit (not always the latest)
- **Trending News** — top headlines via NewsAPI, proxied through a Vercel serverless function in production
- **Categories filter** — filter posts by topic (Technology, Culture, Science, Opinion, Fiction)
- **Newsletter signup band** — with email validation, inline success state, and no emoji

### Navigation
- Scroll-hiding sticky header with blur backdrop on scroll
- Auto-hiding on scroll-down, reappearing on scroll-up
- Active route underline indicator

### Extra Pages
| Page | Path | Description |
|------|------|-------------|
| About | `/about` | The story behind Inkwell, values, and timeline |
| Write for Us | `/write-for-us` | Submission guidelines, FAQ, and one-click email copy |
| Newsletter | `/newsletter` | Dedicated subscribe page with validation |
| Changelog | `/changelog` | Every meaningful change to the platform, documented |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 |
| Routing | React Router v6 |
| State management | Redux Toolkit |
| Forms | React Hook Form |
| Rich text editor | TinyMCE (via `@tinymce/tinymce-react`) |
| Backend / Auth / DB | Appwrite (Cloud) |
| File storage | Appwrite Storage |
| Build tool | Vite 7 |
| Deployment | Vercel |
| News API | NewsAPI.org (proxied via Vercel serverless function) |
| Quote API | quotable.io (free, no key required) |

---

## Project Structure

```
src/
├── appwrite/
│   ├── auth.js          # Appwrite authentication service
│   └── config.js        # Appwrite database, storage, and file services
├── components/
│   ├── Header.jsx       # Sticky scroll-hiding navigation
│   ├── Footer.jsx
│   ├── Logo.jsx
│   ├── Login.jsx        # Login form (used via components/index.js)
│   ├── PostCard.jsx     # Post list item
│   ├── PostForm.jsx     # Create / edit post form
│   ├── RTE.jsx          # TinyMCE rich text editor wrapper
│   ├── AuthLayout.jsx   # Route protection wrapper
│   ├── LogoutBtn.jsx
│   └── index.js         # Barrel exports
├── pages/
│   ├── Home.jsx         # Homepage with all sections
│   ├── Signup.jsx
│   ├── Post.jsx         # Single post view
│   ├── AllPosts.jsx
│   ├── AddPost.jsx
│   ├── EditPost.jsx
│   ├── About.jsx
│   ├── WriteForUs.jsx
│   ├── Newsletter.jsx
│   └── Changelog.jsx
├── store/
│   ├── store.js
│   └── authSlice.js
├── conf/
│   └── conf.js          # Environment variable imports
├── App.jsx
├── main.jsx
└── index.css

api/
└── news.js              # Vercel serverless proxy for NewsAPI
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [Appwrite Cloud](https://cloud.appwrite.io) account (free)
- A [NewsAPI](https://newsapi.org) key (free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/inkwell.git
cd inkwell

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Then fill in your values (see Environment Variables below)

# Start the development server
npm run dev
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_TABLE_ID=your_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
VITE_NEWS_API_KEY=your_newsapi_key
```

> **Never commit your `.env` file.** It is already in `.gitignore`. Add these same variables in Vercel's dashboard under Settings → Environment Variables before deploying.

---

## Deployment

### Vercel (recommended)

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables from your `.env` in Vercel's project settings
4. Deploy — Vercel auto-detects Vite and configures everything

### Appwrite CORS — important

Appwrite restricts which domains can make requests to your project. You must add each hostname as a **Web Platform** in your Appwrite project settings:

| Environment | Hostname to add |
|-------------|----------------|
| Local dev | `localhost` |
| Vercel (all deployments) | `*.vercel.app` |
| Custom domain (if any) | `yourdomain.com` |

Go to: **Appwrite Console → Your Project → Settings → Platforms → Add Platform → Web**

### NewsAPI in production

NewsAPI's free plan blocks direct browser requests in production. This project solves that with a Vercel serverless function at `api/news.js`. It proxies the request server-side so the browser never calls NewsAPI directly, and your API key stays hidden.

In development, the app calls NewsAPI directly (which works on localhost). In production, it automatically calls `/api/news` instead.

---

## Pages

### `/` — Home
The main landing page. Includes an animated hero headline, Quote of the Day (from quotable.io), a randomly selected Featured Post, a Trending News section (via NewsAPI), a Categories filter, a post list, and a newsletter signup band.

### `/login` — Login
Split-panel layout. Left side shows a literary quote on a dark background. Right side has the email/password form with password visibility toggle.

### `/signup` — Sign Up
Same split-panel layout. Right side shows the "Why Inkwell?" feature list.

### `/all-posts` — All Posts
Auth-protected. Lists every published post.

### `/add-post` — New Post
Auth-protected. Full post creation form with TinyMCE editor, slug generation, image upload, and status selector.

### `/edit-post/:slug` — Edit Post
Auth-protected. Same form pre-filled with existing post data. Shows "Unsaved changes" indicator.

### `/post/:slug` — Read Post
Public. Renders the full post with formatted HTML from TinyMCE, featured image, and metadata.

### `/about` — About
The story behind Inkwell, the platform's values, and a timeline.

### `/write-for-us` — Write for Us
Submission guidelines, topic restrictions, format requirements, response time, FAQ, and a one-click email copy button.

### `/newsletter` — Newsletter
Dedicated subscribe page with email validation and inline success state.

### `/changelog` — Changelog
A reverse-chronological log of every meaningful change to the platform, with version numbers, dates, and tagged release types (Feature, Fix, Design, Launch).

---


## Roadmap

- [ ] Pagination / infinite scroll for post lists
- [ ] Proper tag system with Appwrite collection relations
- [ ] User profiles with avatar and bio
- [ ] Reading time estimate on posts
- [ ] Dark mode
- [ ] Comments via Appwrite Realtime
- [ ] Email delivery for newsletter subscribers (Resend / Mailchimp integration)
- [ ] Custom domain with Appwrite custom endpoint (removes the localStorage security warning)
- [ ] RSS feed

---

## License

MIT — do whatever you want with it. A credit or a star would be appreciated but isn't required.

---

<p align="center">
  Built with care by a developer who believes the internet deserves better writing.
</p>
