// components/TweetForm.tsx
'use client';

import { useState } from 'react';

interface TweetFormProps {
  oauthToken: string;
  oauthTokenSecret: string;
  consumerKey: string;
  consumerSecret: string;
}
type RequestData = Record<string, string | number | boolean | string[]>;
export default function TweetForm({ 
  oauthToken, 
  oauthTokenSecret, 
  consumerKey, 
  consumerSecret 
}: TweetFormProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RequestData>();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          text, 
          oauth_token: oauthToken,
          oauth_token_secret: oauthTokenSecret,
          consumer_key: consumerKey,
          consumer_secret: consumerSecret
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to post tweet');
      }
      
      setResult(data);
      setText(''); // Clear form after successful post
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="tweet" className="block mb-2 font-medium">
            `Whats happening?``
          </label>
          <textarea
            id="tweet"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded-md"
            maxLength={280}
            rows={4}
          />
          <div className="text-right text-sm">
            {text.length}/280
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || text.length === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          {isLoading ? 'Posting...' : 'Tweet'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          Tweet posted successfully!
        </div>
      )}
    </div>
  );
}