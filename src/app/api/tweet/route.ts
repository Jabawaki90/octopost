// 2. Create a new API endpoint for tweeting
// app/api/tweet/route.ts

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { XAuth } from '../../../../utils/xAuth';

export async function POST(req: NextRequest) {
  try {
    const cookie = await cookies()
    const accessToken = cookie.get('x_access_token')?.value;
    const accessTokenSecret = cookie.get('x_access_token_secret')?.value;
    
    // Log token verification (remove in production)
    console.log('Using tokens:', {
      tokenPresent: !!accessToken,
      secretPresent: !!accessTokenSecret,
      tokenLastChars: accessToken?.slice(-5),
      secretLastChars: accessTokenSecret?.slice(-5)
    });

    if (!accessToken || !accessTokenSecret) {
      // Clear any remaining tokens and redirect to auth
      cookie.delete('x_access_token');
      cookie.delete('x_access_token_secret');
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
    const tweet = await xAuth.postTweet(text, options);

    
    
    return NextResponse.json(tweet);
  } catch (error) {
    console.error('Error posting tweet:', error);
    return NextResponse.json({ 
      error: 'Failed to post tweet', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}