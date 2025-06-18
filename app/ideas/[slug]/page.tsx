import { prisma } from '../../../lib/prisma';
import IdeaActions from '../../../components/IdeaActions';
import CommentsSection from '../../../components/CommentsSection';
import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth/next';

export async function generateStaticParams() {
  const ideas: { slug: string }[] = await prisma.idea.findMany({ select: { slug: true } });
  return ideas.map((idea) => ({ slug: idea.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const idea = await prisma.idea.findUnique({
    where: { slug: params.slug },
  });
  if (!idea) {
    return { title: 'Idea Not Found' };
  }
  return {
    title: idea.title,
    description: idea.description,
    openGraph: {
      title: idea.title,
      description: idea.description,
      url: `https://your-domain.com/ideas/${idea.slug}`,
    },
  };
}

export default async function IdeaPage({
  params,
}: {
  params: { slug: string };
}) {
  const idea = await prisma.idea.findUnique({ where: { slug: params.slug } });
  if (!idea) {
    return <div className="container mx-auto px-4 py-8">Idea not found</div>;
  }
  // Fetch engagement counts
  const [voteCount, bookmarkCount, buildCount] = await Promise.all([
    prisma.vote.count({ where: { ideaId: idea.id } }),
    prisma.bookmark.count({ where: { ideaId: idea.id } }),
    prisma.builder.count({ where: { ideaId: idea.id } }),
  ]);
  // Fetch comments
  const comments = await prisma.comment.findMany({
    where: { ideaId: idea.id },
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  });
  // Fetch user-specific status
  const session = await getServerSession(authOptions);
  let hasVoted = false;
  let hasBookmarked = false;
  let hasBuilding = false;
  if (session?.user) {
    const userId = session.user.id;
    const [existingVote, existingBookmark, existingBuilder] = await Promise.all([
      prisma.vote.findUnique({ where: { userId_ideaId: { userId, ideaId: idea.id } } }),
      prisma.bookmark.findUnique({ where: { userId_ideaId: { userId, ideaId: idea.id } } }),
      prisma.builder.findUnique({ where: { userId_ideaId: { userId, ideaId: idea.id } } }),
    ]);
    hasVoted = Boolean(existingVote);
    hasBookmarked = Boolean(existingBookmark);
    hasBuilding = Boolean(existingBuilder);
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
        <p className="text-sm text-gray-500 mb-4">{idea.category}</p>
        <div className="flex space-x-6 text-gray-600 mb-6">
          <span className="flex items-center space-x-1">
            <span className="text-lg">👍</span>
            <span className="text-sm">{voteCount}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="text-lg">🔖</span>
            <span className="text-sm">{bookmarkCount}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="text-lg">🛠️</span>
            <span className="text-sm">{buildCount}</span>
          </span>
        </div>
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Problem</h2>
          <p>{idea.description}</p>
        </section>
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">MVP</h2>
          <p>{idea.mvp}</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">Monetization</h2>
          <p>{idea.monetization}</p>
        </section>
        <IdeaActions
          ideaId={idea.id}
          initialVoteCount={voteCount}
          initialBookmarkCount={bookmarkCount}
          initialBuildCount={buildCount}
          hasVoted={hasVoted}
          hasBookmarked={hasBookmarked}
          hasBuilding={hasBuilding}
        />
        <CommentsSection ideaId={idea.id} initialComments={comments.map((c: any) => ({
          id: c.id,
          content: c.content,
          createdAt: c.createdAt.toISOString(),
          user: { name: c.user.name, email: c.user.email },
        }))} />
      </div>
    </div>
  );
}