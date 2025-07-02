'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export function AuthButton() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  if (isLoading) {
    return <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>;
  }

  if (session) {
    return (
      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
        <span className="text-sm text-gray-100 lg:text-gray-700 truncate">
          {session.user?.name || session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors text-sm"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Link
        href="/login"
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors text-center text-sm"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="bg-gray-600 lg:bg-gray-100 hover:bg-gray-700 lg:hover:bg-gray-200 text-white lg:text-gray-800 font-medium py-2 px-4 rounded transition-colors text-center text-sm"
      >
        Register
      </Link>
    </div>
  );
} 