// 5. Create a React component to initiate authentication - components/XLoginButton.tsx
'use client';

// import { useState } from 'react';

export default function XLoginButton() {
  // const [isLoading, setIsLoading] = useState(false);

  // const handleLogin = async () => {
  //   setIsLoading(true);
  //   // Redirect to our API endpoint which will handle the OAuth flow
  //   window.location.href = '/api/auth/x';
  // };

  const handleTweet = async (tweetText: string) => {
    const response = await fetch('/api/tweets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet: tweetText }),
    });
  
    if (response.ok) {
      console.log('Tweet posted successfully!');
    } else {
      const error: { message: string } = await response.json() as { message: string };
      console.error('Failed to post tweet:', error);
    }
  };

  return (
    // <button
    //   onClick={handleLogin}
    //   disabled={isLoading}
    //   className="bg-black text-white py-2 px-4 rounded-md flex items-center gap-2"
    // >
    //   {isLoading ? 'Connecting...' : 'Login with X'}
    // </button>
    <button onClick={() => handleTweet('Hello from OAuth 2.0!')}>Post Tweet</button>
  );
}