// app/tweet/page.tsx
'use server'

import { cookies } from 'next/headers';
import TweetForms from '../components/TweetForms';
import { redirect } from 'next/navigation';

export default async function TweetPage() {
  // Get credentials from a secure storage method
  const cookieStore = await cookies();
  const oauthToken = cookieStore.get('twitter_oauth_token')?.value;
  const oauthTokenSecret = cookieStore.get('twitter_oauth_token_secret')?.value;
  
  // These should be fetched from environment variables
  const consumerKey = process.env.CLIENT_API_KEY || '';
  const consumerSecret = process.env.CLIENT_API_SECRET_KEY || '';
  
  // Redirect if not authenticated
  if (!oauthToken || !oauthTokenSecret) {
    redirect('/auth/twitter');
  }
  
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Post a Tweet</h1>
      <TweetForms 
        oauthToken={oauthToken}
        oauthTokenSecret={oauthTokenSecret}
        consumerKey={consumerKey}
        consumerSecret={consumerSecret}
      />
    </div>
  );
}