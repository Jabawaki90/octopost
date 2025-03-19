// app/instagram-login/page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function InstagramLoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/api/auth/instagram');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connect with Instagram
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connect your Instagram account to post images from our app
          </p>
        </div>
        
        <div>
          <button
            onClick={handleLogin}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Connect Instagram Account
          </button>
        </div>
      </div>
    </div>
  );
}