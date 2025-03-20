// 3. Create API route for initiating auth - app/api/auth/x/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { XAuth } from '../../../../../utils/xAuth';

export async function GET() {
  try {
    const cookie = await cookies();
    cookie.delete('x_access_token')
    cookie.delete('x_access_token_secret')
    const xAuth = new XAuth({
      apiKey: process.env.CLIENT_API_KEY!,
      apiSecretKey: process.env.CLIENT_API_SECRET_KEY!,
    });

    // Your callback URL
    const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/x/callback`;

    // Get a new request token
    const requestToken = await xAuth.getRequestToken(callbackUrl);

    // Store oauth_token_secret in a cookie
    cookie.set('oauth_token_secret', requestToken.oauth_token_secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10, // 10 minutes
      path: '/'
    });

    // Get authorization URL
    const authUrl = xAuth.getAuthorizationUrl(requestToken.oauth_token);

    // Redirect user to X authorization page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating X auth:', error);
    return NextResponse.json({ error: 'Failed to initiate authentication' }, { status: 500 });
  }
}