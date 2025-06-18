import IdeasList from '../components/IdeasList';
import Link from 'next/link';
import { prisma } from '../lib/prisma';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q || '';
  const pageSize = 20;
  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
        ],
      }
    : {};
  const initialIdeas = await prisma.idea.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: pageSize,
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      description: true,
      _count: { select: { votes: true, bookmarks: true, builders: true } },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Daily AI-Generated Startup Ideas</h1>
        <p className="text-lg mb-4">
          Browse fresh ideas, upvote your favorites, bookmark them, and start building!
        </p>
        <div className="flex flex-col items-center">
          <Link
            href="/submit"
            className="mt-4 inline-block bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Submit Your Idea
          </Link>
        </div>
      </div>
      {/* Ideas Grid with Pagination */}
      <IdeasList initialIdeas={initialIdeas} pageSize={pageSize} searchQuery={q} />
    </div>
  );
}