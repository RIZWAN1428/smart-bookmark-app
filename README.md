# Smart Bookmark App

A simple bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS.

## Live Demo

https://smart-bookmark-app-xi.vercel.app/

## GitHub Repository

https://github.com/RIZWAN1428/smart-bookmark-app

---

## Features

- Sign in using Google OAuth (Supabase Auth)
- Add bookmarks (URL + title)
- Bookmarks are private per user
- Real-time updates across tabs
- Users can delete their own bookmarks
- Deployed on Vercel

---

## Tech Stack

- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- Vercel (Deployment)

---

## Database Schema

Table: `bookmarks`

Columns:

- id (uuid, primary key, default: gen_random_uuid())
- user_id (uuid, default: auth.uid())
- url (text, not null)
- title (text, not null)

Row Level Security (RLS) policies ensure:
- Users can read their own bookmarks
- Users can insert their own bookmarks
- Users can delete their own bookmarks

---

## Realtime Implementation

The app subscribes to changes in the `bookmarks` table using Supabase Realtime.  
When a bookmark is added or deleted in one tab, other open tabs update automatically.

---

## Problems Faced & Solutions

### 1. Google OAuth Client ID error
Issue: Invalid characters in Google Client ID.  
Solution: Created correct OAuth credentials in Google Cloud and copied proper Client ID.

### 2. RLS preventing inserts
Issue: Insert failed due to missing user_id default.  
Solution: Set default value of `user_id` to `auth.uid()`.

### 3. Realtime not updating
Issue: Table not included in publication.  
Solution: Added `bookmarks` table to `supabase_realtime` publication.

### 4. Environment variables not working on Vercel
Issue: App showed default Next.js page.  
Solution: Added:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY  
in Vercel environment variables.

---

## Local Development

1. Clone repository

git clone https://github.com/RIZWAN1428/smart-bookmark-app.git


2. Install dependencies

npm install


3. Create `.env.local`

NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key


4. Run development server

npm run dev


---

## Deployment

Deployed on Vercel with environment variables configured in project settings.

---

## Time Taken

Completed within the 72-hour time limit.