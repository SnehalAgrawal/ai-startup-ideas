'use client';
 
import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';

interface Props {
  ideaId: number;
  initialVoteCount: number;
  initialBookmarkCount: number;
  initialBuildCount: number;
  hasVoted: boolean;
  hasBookmarked: boolean;
  hasBuilding: boolean;
}

export default function IdeaActions({
  ideaId,
  initialVoteCount,
  initialBookmarkCount,
  initialBuildCount,
  hasVoted,
  hasBookmarked,
  hasBuilding,
}: Props) {
  const { data: session } = useSession();
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);
  const [buildCount, setBuildCount] = useState(initialBuildCount);
  const [voted, setVoted] = useState(hasVoted);
  const [bookmarked, setBookmarked] = useState(hasBookmarked);
  const [building, setBuilding] = useState(hasBuilding);

  const handleVote = async () => {
    if (!session) {
      signIn();
      return;
    }
    if (voted) return;
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideaId }),
    });
    if (res.ok) {
      const data = await res.json();
      setVoteCount(data.count);
      setVoted(true);
    }
  };

  const handleBookmark = async () => {
    if (!session) {
      signIn();
      return;
    }
    if (bookmarked) return;
    const res = await fetch('/api/bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideaId }),
    });
    if (res.ok) {
      const data = await res.json();
      setBookmarkCount(data.count);
      setBookmarked(true);
    }
  };

  const handleBuild = async () => {
    if (!session) {
      signIn();
      return;
    }
    if (building) return;
    const res = await fetch('/api/build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideaId, status: 'started' }),
    });
    if (res.ok) {
      const data = await res.json();
      setBuildCount(data.count);
      setBuilding(true);
    }
  };


  return (
    <div className="flex space-x-4 mt-6">
      <button
        onClick={handleVote}
        disabled={session || voted}
        className={`px-4 py-2 rounded text-white ${
          voted ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {voted ? 'Upvoted' : 'Upvote'} ({voteCount})
      </button>
      <button
        onClick={handleBookmark}
        disabled={session || bookmarked}
        className={`px-4 py-2 rounded text-white ${
          bookmarked ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'
        }`}
      >
        {bookmarked ? 'Bookmarked' : 'Bookmark'} ({bookmarkCount})
      </button>
      <button
        onClick={handleBuild}
        disabled={session || building}
        className={`px-4 py-2 rounded text-white ${
          building ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {building ? "Building" : "I'm building this"} ({buildCount})
      </button>
    </div>
  );
}