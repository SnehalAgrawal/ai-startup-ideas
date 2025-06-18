import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { ideaId, content } = await request.json();
  if (!content || !ideaId) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
  const comment = await prisma.comment.create({
    data: {
      ideaId,
      userId: session.user.id,
      content,
    },
    include: { user: true },
  });
  return NextResponse.json({ success: true, comment });
}