import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { XAuth } from '../../../../../../utils/xAuth';

export async function GET(req: NextRequest) {
  try {
    const cookie = await cookies();
    const url = new URL(req.url);
    const oauthToken = url.searchParams.get('oauth_token');
    const oauthVerifier = url.searchParams.get('oauth_verifier');
    
    // Get the oauth_token_secret from cookies
    const oauthTokenSecret = cookie.get('oauth_token_secret')?.value;
    
    // Clear ALL existing tokens
    cookie.delete('oauth_token_secret');
    cookie.delete('x_access_token');
    cookie.delete('x_access_token_secret');
    
    if (!oauthToken || !oauthVerifier || !oauthTokenSecret) {
      return NextResponse.json({ error: 'Missing required OAuth parameters' }, { status: 400 });
    }
    
    // Initialize XAuth with your API credentials
    const xAuth = new XAuth({
      apiKey: process.env.CLIENT_API_KEY!,
      apiSecretKey: process.env.CLIENT_API_SECRET_KEY!,
    });
    
    // Exchange request token for access token
    const accessToken = await xAuth.getAccessToken(oauthToken, oauthVerifier);
    
    // Log new tokens (remove in production)
    console.log('New tokens generated:', {
      token: accessToken.oauth_token.slice(-5),
      secret: accessToken.oauth_token_secret.slice(-5)
    });

    // Store the new access token and secret in secure cookies
    cookie.set('x_access_token', accessToken.oauth_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });
    
    cookie.set('x_access_token_secret', accessToken.oauth_token_secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    // Remove the old OAuth 2.0 implementation callback route
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/tweet`);
  } catch (error) {
    console.error('Error in X auth callback:', error);
    return NextResponse.json({ 
      error: 'Authentication failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}