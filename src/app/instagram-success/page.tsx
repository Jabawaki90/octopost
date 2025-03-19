// app/instagram-success/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function InstagramSuccessPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Instagram Connected!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your Instagram account (ID: {userId}) has been successfully connected to our app.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Link href="/dashboard" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}