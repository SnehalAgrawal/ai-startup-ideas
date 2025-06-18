import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Your Bookmarked Ideas',
  description: 'Ideas you have bookmarked',
};

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/api/auth/signin');
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    include: { idea: true },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Your Bookmarked Ideas</h1>
      {bookmarks.length ? (
        <ul className="space-y-4">
          {bookmarks.map((bm: any) => (
            <li key={bm.id}>
              <Link href={`/ideas/${bm.idea.slug}`} className="text-blue-500 hover:underline">
                {bm.idea.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no bookmarks yet.</p>
      )}
    </div>
  );
}