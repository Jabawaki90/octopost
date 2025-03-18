const handleTweet = async (tweetText: string) => {
  const response = await fetch('/api/tweet', {
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

// Example usage in a component
<button onClick={() => handleTweet('Hello from OAuth 2.0!')}>Post Tweet</button>