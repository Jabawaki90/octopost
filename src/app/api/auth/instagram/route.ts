// app/api/auth/instagram/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
  const REDIRECT_URI = process.env.NODE_ENV === 'production' 
    ? 'https://octopost-henna.vercel.app/api/auth/callback/instagram'
    : 'https://octopost-henna.vercel.app/api/auth/callback/instagram';
  
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user_profile,user_media&response_type=code`;
  
  return NextResponse.redirect(authUrl);
}