import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Ideas You're Building",
  description: 'Ideas you have started building',
};

export default async function BuildingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/api/auth/signin');
  const builds = await prisma.builder.findMany({
    where: { userId: session.user.id },
    include: { idea: true },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Ideas You're Building</h1>
      {builds.length ? (
        <ul className="space-y-4">
          {builds.map((b: any) => (
            <li key={b.id} className="flex items-center">
              <Link href={`/ideas/${b.idea.slug}`} className="text-blue-500 hover:underline">
                {b.idea.title}
              </Link>
              <span className="ml-2 text-sm text-gray-500">({b.status})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't started building any ideas yet.</p>
      )}
    </div>
  );
}