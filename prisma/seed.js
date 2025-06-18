const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');

const prisma = new PrismaClient();

async function main() {
  const ideas = [
    {
      title: "AI-Powered Legal Assistant for Startups",
      category: "AI",
      description:
        "A GPT-based assistant that drafts, explains, and customizes startup legal docs.",
      mvp: "Simple UI where users input prompts and get editable legal templates.",
      monetization: "Subscription or pay-per-document",
    },
    {
      title: "Remote Team Standup Video Recorder",
      category: "Productivity",
      description: "Async video standups that compile into a daily digest.",
      mvp: "Record short video updates and view them on a timeline.",
      monetization: "Freemium model with storage limits",
    },
    {
      title: "Developer Tool for API Mocking with AI",
      category: "DevTools",
      description:
        "Generate fake but realistic JSON APIs from OpenAPI specs using LLMs.",
      mvp: "CLI + Web interface that creates mock servers.",
      monetization: "Pro features with rate limits or integrations",
    },
    {
      title: "Micro-SaaS Billing + User Management",
      category: "SaaS",
      description: "Plug-and-play billing and user auth for solo devs.",
      mvp: "SDKs for Stripe/Auth0 integration with backend templates.",
      monetization: "Monthly subscription",
    },
    {
      title: "Habit Tracker in Your Email",
      category: "Productivity",
      description: "Track habits with daily email check-ins instead of apps.",
      mvp: "Email-based journaling and stats view.",
      monetization: "Premium analytics and data export",
    },
    {
      title: "AI Meme Generator for Social Campaigns",
      category: "AI",
      description:
        "Marketers create viral memes from text or campaign themes.",
      mvp: "Upload a theme + prompt, get 10 shareable memes.",
      monetization: "Pay per campaign",
    },
    {
      title: "Event Planner CRM",
      category: "SaaS",
      description: "Lightweight CRM for independent event planners.",
      mvp: "Event management dashboard, task tracking, and client notes.",
      monetization: "Monthly SaaS pricing",
    },
    {
      title: "LLM-powered Flashcard Creator",
      category: "Education",
      description:
        "Turn textbooks or lecture notes into flashcards automatically.",
      mvp: "Upload PDF, get a quiz deck.",
      monetization: "Subscription with upload limits",
    },
    {
      title: "Voice-to-Ticket App for Support Teams",
      category: "AI",
      description:
        "Support reps speak into their phone, get structured tickets.",
      mvp: "Mobile app with transcription and ticket tagging.",
      monetization: "Team plans",
    },
    {
      title: "Startup Idea Journal",
      category: "Productivity",
      description:
        "Log, tag, and rate ideas over time to identify patterns.",
      mvp: "Web journal with filters and export.",
      monetization: "Lifetime deal or SaaS",
    },
  ];

  for (const idea of ideas) {
    const slug = slugify(idea.title, { lower: true });
    await prisma.idea.upsert({
      where: { slug },
      update: {},
      create: { ...idea, slug },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });