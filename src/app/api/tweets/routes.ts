// app/api/tweet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';

export async function POST(req: NextRequest) {
  try {
    const { text, oauth_token, oauth_token_secret, consumer_key, consumer_secret } = await req.json();
    
    // Initialize OAuth
    const oauth = new OAuth({
      consumer: {
        key: consumer_key,
        secret: consumer_secret
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64');
      }
    });
    
    const requestData = {
      url: 'https://api.x.com/1.1/statuses/update.json',
      method: 'POST',
      data: { status: text }
    };
    
    // Generate authorization header
    const authorization = oauth.authorize(requestData, {
      key: oauth_token,
      secret: oauth_token_secret
    });
    
    const authHeader = oauth.toHeader(authorization);
    
    // Make the request
    const response = await fetch(requestData.url, {
      method: requestData.method,
      headers: {
        ...authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(requestData.data).toString()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error posting tweet:', error);
    return NextResponse.json({ error: 'Failed to post tweet' }, { status: 500 });
  }
}