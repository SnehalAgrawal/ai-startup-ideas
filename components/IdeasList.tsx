'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Idea {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  _count: { votes: number; bookmarks: number; builders: number };
}

interface Props {
  initialIdeas: Idea[];
  pageSize: number;
  searchQuery?: string;
}

export default function IdeasList({ initialIdeas, pageSize, searchQuery }: Props) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const skip = page * pageSize;
    const qParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : '';
    const res = await fetch(`/api/ideas?skip=${skip}&take=${pageSize}${qParam}`);
    if (res.ok) {
      const more: Idea[] = await res.json();
      setIdeas((prev) => [...prev, ...more]);
      setPage((prev) => prev + 1);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {ideas.map((idea) => (
          <Link
            key={idea.id}
            href={`/ideas/${idea.slug}`}
            className="block h-full"
          >
            <div className="bg-white p-4 rounded shadow hover:shadow-md transition flex flex-col h-full">
              <h2 className="text-xl font-semibold">{idea.title}</h2>
              <p className="text-sm text-gray-600">{idea.category}</p>
              <p className="mt-2 text-gray-700 flex-1 line-clamp-2">
                {idea.description}
              </p>
              <div className="mt-auto flex space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <span>👍</span>
                  <span>{idea._count.votes}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🔖</span>
                  <span>{idea._count.bookmarks}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🛠️</span>
                  <span>{idea._count.builders}</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-6">
        <button
          onClick={loadMore}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    </>
  );
}