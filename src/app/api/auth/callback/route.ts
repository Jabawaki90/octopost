// import { setCookie } from 'cookies-next';
// import fetch from 'node-fetch';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest): Promise<NextResponse> {
//   const { searchParams } = new URL(request.url);
//   const code = searchParams.get('code');
// //   const state = searchParams.get('state');
//   const codeVerifier = request.cookies.get('code_verifier')?.value;

//   // Validate inputs
//   if (!code || !codeVerifier) {
//     return NextResponse.json({ error: 'Missing code or code verifier' }, { status: 400 });
//   }

//   const tokenUrl = 'https://api.x.com/2/oauth2/token';
//   const body = new URLSearchParams({
//     code,
//     grant_type: 'authorization_code',
//     client_id: process.env.CLIENT_ID!,
//     redirect_uri: 'https://octopost-henna.vercel.app/api/auth/callback',
//     code_verifier: codeVerifier,
//   });

//   const authHeader = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_ID_SECRET}`).toString('base64');

//   const response = await fetch(tokenUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Authorization': `Basic ${authHeader}`,
//     },
//     body: body.toString(),
//   });

//   interface TokenResponse {
//     access_token: string;
//     token_type: string;
//     expires_in: number;
//     refresh_token?: string;
//     scope?: string;
//   }

//   const data: TokenResponse = await response.json() as TokenResponse;
//   if (!response.ok) {
//     console.error('Token exchange failed:', data);
//     return NextResponse.json({ error: 'Failed to exchange token' }, { status: 500 });
//   }

//   // Store access token in a secure cookie
//   setCookie('x_access_token', data.access_token, {
//     req: request,
//     httpOnly: true,
//     secure: true,
//     maxAge: 3600, // 1 hour
//   });

//   // Redirect to homepage
//   return NextResponse.redirect(new URL('/', request.url));
// }