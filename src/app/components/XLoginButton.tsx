// 5. Create a React component to initiate authentication - components/XLoginButton.tsx
'use client';

import { useState } from 'react';

export default function XLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Redirect to our API endpoint which will handle the OAuth flow
    window.location.href = '/api/auth/x';
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="bg-black text-white py-2 px-4 rounded-md flex items-center gap-2"
    >
      {isLoading ? 'Connecting...' : 'Login with X'}
    </button>
  );
}