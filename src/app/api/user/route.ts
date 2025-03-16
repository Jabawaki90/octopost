// 7. Create an API route to fetch user data - app/api/user/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { XAuth } from '../../../../utils/xAuth';

export async function GET() {
  try {
    // Get access tokens from cookies
    const cookie = await cookies()
    const accessToken = cookie.get('x_access_token')?.value;
    const accessTokenSecret = cookie.get('x_access_token_secret')?.value;
    
    if (!accessToken || !accessTokenSecret) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Initialize XAuth with your API credentials and the user's access tokens
    const xAuth = new XAuth({
      apiKey: process.env.X_API_KEY!,
      apiSecretKey: process.env.X_API_SECRET_KEY!,
      accessToken,
      accessTokenSecret
    });
    
    // Make an authenticated request to get user data
    const userData = await xAuth.makeAuthenticatedRequest(
      'https://api.x.com/1.1/account/verify_credentials.json',
      'GET'
    );
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}