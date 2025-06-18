import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const skip = parseInt(url.searchParams.get('skip') || '0', 10);
  const take = parseInt(url.searchParams.get('take') || '20', 10);
  const q = url.searchParams.get('q') || undefined;
  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
        ],
      }
    : {};
  const ideas = await prisma.idea.findMany({
    skip,
    take,
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      description: true,
      _count: { select: { votes: true, bookmarks: true, builders: true } },
    },
  });
  return NextResponse.json(ideas);
}