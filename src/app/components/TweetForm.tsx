'use client';

import { useState } from 'react';

type RequestData = Record<string, string | number | boolean | string[]>;

interface TweetFormProps {
  onSuccess?: (tweetData: RequestData) => void;
  onError?: (error: Error) => void;
}

export default function TweetForm({ onSuccess, onError }: TweetFormProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!text.trim()) {
      setError('Tweet cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to post tweet');
      }
      
      // Success - clear the form
      setText('');
      setCharCount(0);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data);
      }
      
    } catch (err) {
      setError((err as Error).message);
      
      // Call error callback if provided
      if (onError) {
        onError(err as Error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Post a Tweet</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="What's happening?"
            value={text}
            onChange={handleTextChange}
            disabled={isSubmitting}
            maxLength={280}
          />
          <div className="flex justify-between text-sm mt-1">
            <span className={`${charCount > 280 ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount}/280
            </span>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || charCount > 280}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting...' : 'Tweet'}
        </button>
      </form>
    </div>
  );
}