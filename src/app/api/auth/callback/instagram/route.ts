// app/api/auth/callback/instagram/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
  const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/callback/instagram';
  
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', 
      new URLSearchParams({
        client_id: INSTAGRAM_APP_ID as string,
        client_secret: INSTAGRAM_APP_SECRET as string,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const { access_token, user_id } = tokenResponse.data;
    
    // Get long-lived access token
    const longLivedTokenResponse = await axios.get('https://graph.instagram.com/access_token', {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: INSTAGRAM_APP_SECRET,
        access_token
      }
    });
    
    const longLivedToken = longLivedTokenResponse.data.access_token;
    
    // Store tokens in cookies
    const cookieStore = await cookies();
    cookieStore.set('instagram_access_token', longLivedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 24 * 60 * 60, // 60 days
      path: '/'
    });
    
    cookieStore.set('instagram_user_id', user_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 24 * 60 * 60, // 60 days
      path: '/'
    });
    
    // Redirect to the Instagram post page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/instagram`);
  } catch (error) {
    console.error('Error in Instagram auth callback:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}