import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth/next';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const { ideaId } = await request.json();
  // Prevent multiple votes per user
  const existing = await prisma.vote.findUnique({
    where: { userId_ideaId: { userId, ideaId } },
  });
  if (!existing) {
    await prisma.vote.create({ data: { ideaId, userId, type: 'upvote' } });
  }
  const count = await prisma.vote.count({ where: { ideaId } });
  return NextResponse.json({ success: true, count });
}