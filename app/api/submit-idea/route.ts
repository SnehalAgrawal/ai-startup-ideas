import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: Request) {
  const data = await request.json();
  const slug = data.title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
  const idea = await prisma.idea.create({
    data: {
      title: data.title,
      slug,
      category: data.category,
      description: data.description,
      mvp: data.mvp,
      monetization: data.monetization,
    },
  });
  return NextResponse.json({ success: true, idea });
}