'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  return (
    <header className="bg-white shadow">
    <div className="container mx-auto px-4 py-4 flex items-center gap-4">
      {/* Logo */}
      <Link href="/" className="flex items-center text-xl font-bold whitespace-nowrap">
        <img src="/favicon.svg" alt="logo" className="w-8 h-8 mr-2" />
        <span>AI Startup Ideas</span>
      </Link>

      {/* Search Form (flex-grow to take up remaining space) */}
      <form action="/" method="GET" className="flex flex-grow max-w-4xl">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search ideas..."
          className="flex-grow p-2 rounded-l border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {/* Navigation */}
      <nav className="flex items-center space-x-4 whitespace-nowrap">
        <Link href="/"><span className="hover:underline">Home</span></Link>
        <Link href="/about"><span className="hover:underline">About</span></Link>
        <Link href="/submit"><span className="hover:underline">Submit Idea</span></Link>
        {session && (
          <>
            <Link href="/bookmarks"><span className="hover:underline">Bookmarks</span></Link>
            <Link href="/building"><span className="hover:underline">Building</span></Link>
          </>
        )}
        {session ? (
          <button onClick={() => signOut()} className="hover:underline ml-4">Logout</button>
        ) : (
          <button onClick={() => signIn()} className="hover:underline ml-4">Login</button>
        )}
      </nav>
    </div>
  </header>
  );
}