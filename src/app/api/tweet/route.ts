// 2. Create a new API endpoint for tweeting
// app/api/tweet/route.ts

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { XAuth } from '../../../../utils/xAuth';

export async function POST(req: NextRequest) {
  try {
    // Get access tokens from cookies
    const cookie = await cookies()
    const accessToken = cookie.get('x_access_token')?.value;
    const accessTokenSecret = cookie.get('x_access_token_secret')?.value;
    
    if (!accessToken || !accessTokenSecret) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Parse the request body
    const { text, replyToId, mediaIds, sensitive } = await req.json();
    
    // Validate the tweet text
    if (!text || text.length === 0) {
      return NextResponse.json({ error: 'Tweet text is required' }, { status: 400 });
    }
    
    if (text.length > 280) {
      return NextResponse.json({ 
        error: 'Tweet text exceeds 280 characters' 
      }, { status: 400 });
    }

    console.log('x-- apiKey:', process.env.CLIENT_API_KEY);
    console.log('x-- apiSecretKey:', process.env.CLIENT_API_SECRET_KEY);
    console.log('x-- accessToken:', accessToken);
    console.log('x-- accessTokenSecret:', accessTokenSecret);
    
    
    // Initialize XAuth with your API credentials and the user's access tokens
    const xAuth = new XAuth({
      apiKey: process.env.CLIENT_API_KEY!,
      apiSecretKey: process.env.CLIENT_API_SECRET_KEY!,
      accessToken,
      accessTokenSecret
    });
    
    // Optional parameters
    const options: {
      reply_to_status_id?: string;
      media_ids?: string[];
      possibly_sensitive?: boolean;
    } = {};
    
    if (replyToId) options.reply_to_status_id = replyToId;
    if (mediaIds) options.media_ids = mediaIds;
    if (sensitive) options.possibly_sensitive = sensitive;
    
    // Post the tweet
    // const tweet = await xAuth.postTweet(text, options);
    const response = await xAuth.makeAuthenticatedRequest(
      'https://api.x.com/1.1/statuses/update.json',
      'POST',
      { status: 'Hello, this is my tweet!' },
    );

    console.log('x-- responsess:', response);
    
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error posting tweet:', error);
    return NextResponse.json({ 
      error: 'Failed to post tweet', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}