// app/api/auth/callback/instagram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
  const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
  const REDIRECT_URI = process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com/api/auth/callback/instagram'
    : 'http://localhost:3000/api/auth/callback/instagram';
  
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
    
    // Get long-lived access token (valid for 60 days)
    const longLivedTokenResponse = await axios.get('https://graph.instagram.com/access_token', {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: INSTAGRAM_APP_SECRET,
        access_token
      }
    });
    
    const longLivedToken = longLivedTokenResponse.data.access_token;

    console.log('x-- longLivedToken:', longLivedToken);
    
    
    // Store these tokens securely in your database associated with the user
    // Example with an ORM like Prisma:
    // await prisma.user.update({
    //   where: { id: currentUserId },
    //   data: {
    //     instagramUserId: user_id,
    //     instagramAccessToken: longLivedToken,
    //     instagramTokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    //   }
    // });
    
    
    // Create a cookie with a session token or redirect with success message
    const redirectUrl = new URL('/instagram-success', request.url);
    redirectUrl.searchParams.set('userId', user_id);
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Instagram auth error:', error);
    return NextResponse.json({ error: 'Failed to authenticate with Instagram' }, { status: 500 });
  }
}