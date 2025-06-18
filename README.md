# AI Startup Ideas

A Next.js 14 MVP application to share daily AI-generated startup or side-hustle ideas.

## Features
- Landing page with latest ideas
- Idea detail page with engagement buttons (Upvote, Bookmark, I'm building this)
- About page
- Submit idea form
- REST API routes for data operations
- Prisma ORM with MySQL
- Tailwind CSS styling
- SEO-friendly routing and metadata
- User authentication with GitHub via NextAuth.js
- Per-user upvote, bookmark, and "building" actions (once-per-user)
- User dashboard pages for Bookmarks and Building

## Setup (Local)

1. Clone the repo.
2. Copy `.env.example` to `.env` and update `DATABASE_URL` and NextAuth variables.
   Also set NextAuth variables in `.env`:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret
   GITHUB_ID=your-github-client-id
   GITHUB_SECRET=your-github-client-secret
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Generate Prisma client, run migrations, and seed initial data:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
   If you modify the Prisma schema (e.g., adding comments), run:
   ```bash
   npx prisma migrate dev --name add_comments
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

The app will be available at http://localhost:3000.

## Deployment

- Deploy to Vercel by connecting your Git repository.
- Ensure `DATABASE_URL` is set in Vercel environment variables.

## Future Improvements
- Add authentication (GitHub, Google, Email credentials).
- Admin UI for idea moderation.
- Dynamic Open Graph image generation.
- Pagination and search.
- User profiles and personalized feeds.