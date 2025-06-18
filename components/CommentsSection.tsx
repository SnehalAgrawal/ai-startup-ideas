'use client';

import { useState, FormEvent } from 'react';
import { useSession, signIn } from 'next-auth/react';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: { name?: string; email?: string };
}

interface Props {
  ideaId: number;
  initialComments: Comment[];
}

export default function CommentsSection({ ideaId, initialComments }: Props) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!session) {
      signIn();
      return;
    }
    if (!content.trim()) return;
    setSubmitting(true);
    const res = await fetch('/api/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideaId, content }),
    });
    if (res.ok) {
      const { comment } = await res.json();
      setComments((prev) => [...prev, {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: comment.user,
      }]);
      setContent('');
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-700 mb-1">{c.content}</p>
            <div className="text-xs text-gray-500">
              {c.user.name || c.user.email} •{' '}
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Add a comment..."
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}