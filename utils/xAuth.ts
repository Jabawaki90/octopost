import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

// Types for our authentication
interface XAuthCredentials {
  apiKey: string;
  apiSecretKey: string;
  accessToken?: string;
  accessTokenSecret?: string;
}

interface RequestTokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_callback_confirmed: string;
}

// Define a type for request data
type RequestData = Record<string, string | number | boolean | string[]>;

export class XAuth {
  private oauth: OAuth;
  private credentials: XAuthCredentials;
  
  constructor(credentials: XAuthCredentials) {
    this.credentials = credentials;
    
    // Initialize OAuth
    this.oauth = new OAuth({
      consumer: {
        // key: credentials.apiKey,
        key: process.env.CLIENT_API_KEY!,
        // secret: credentials.apiSecretKey
        secret: process.env.CLIENT_API_SECRET_KEY!
      },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString, key) {
        return crypto
          .createHmac('sha1', key)
          .update(baseString)
          .digest('base64');
      }
    });
  }

  // Get request token
  async getRequestToken(callbackUrl: string): Promise<RequestTokenResponse> {
    const request = {
      url: 'https://api.x.com/oauth/request_token',
      method: 'POST',
      data: { oauth_callback: callbackUrl }
    };

    console.log('x-- request:', request);
    
    
    // Get authorization header
    const authHeader = this.oauth.toHeader(this.oauth.authorize(request));
    console.log('x-- authHeader:', authHeader);

    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          ...authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(request.data).toString()
      });

      console.log('x-- response:', response);
      
      
      if (!response.ok) {
          throw new Error(`Failed to get request token: ${response.status} ${response.statusText}`);
        }
        
        const responseText = await response.text();
        console.log('x-- responseText:', responseText);
        const parsedResponse = this.parseResponseText(responseText);
        console.log('x-- parsedResponse:', parsedResponse);
      
      // Convert to RequestTokenResponse with validation
      return this.toRequestTokenResponse(parsedResponse);
    } catch (error) {
      console.error('Error getting request token:', error);
      throw error;
    }
  }

  // Convert and validate the parsed response to RequestTokenResponse
  private toRequestTokenResponse(response: Record<string, string>): RequestTokenResponse {
    // Check required fields
    if (!response.oauth_token) {
      throw new Error('Missing oauth_token in response');
    }
    if (!response.oauth_token_secret) {
      throw new Error('Missing oauth_token_secret in response');
    }
    if (!response.oauth_callback_confirmed) {
      throw new Error('Missing oauth_callback_confirmed in response');
    }
    
    // Return a new object with the required structure
    return {
      oauth_token: response.oauth_token,
      oauth_token_secret: response.oauth_token_secret,
      oauth_callback_confirmed: response.oauth_callback_confirmed
    };
  }

  // Get authorization URL
  getAuthorizationUrl(oauthToken: string): string {
    return `https://api.x.com/oauth/authorize?oauth_token=${oauthToken}`;
  }

  // Exchange request token for access token
  async getAccessToken(oauthToken: string, oauthVerifier: string) {
    const request = {
      url: 'https://api.x.com/oauth/access_token',
      method: 'POST',
      data: { 
        oauth_token: oauthToken,
        oauth_verifier: oauthVerifier
      }
    };

    // Get authorization header
    const authHeader = this.oauth.toHeader(this.oauth.authorize(request));

    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          ...authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(request.data).toString()
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
      }

      const responseText = await response.text();
      return this.parseResponseText(responseText);
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  // Make authenticated requests to X API
  async makeAuthenticatedRequest(
    url: string, 
    method: string, 
    data?: RequestData
  ): Promise<Record<string, unknown>> {
    if (!this.credentials.accessToken || !this.credentials.accessTokenSecret) {
      throw new Error('Access token and secret are required for authenticated requests');
    }
console.log('x-- urls:', url);

    const request = {
      url,
      method,
      data: data || {}
    };

    // Set token for this request
    const token = {
      key: this.credentials.accessToken,
      secret: this.credentials.accessTokenSecret
    };

    // Get authorization header
    const authHeader = this.oauth.toHeader(this.oauth.authorize(request, token));

    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          ...authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: method === 'POST' ? new URLSearchParams(data as Record<string, string>).toString() : undefined
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error making authenticated request:', error);
      throw error;
    }
  }

  // Helper to parse response text in format: oauth_token=xyz&oauth_token_secret=abc
  private parseResponseText(text: string): Record<string, string> {
    const result: Record<string, string> = {};
    const pairs = text.split('&');
    
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      result[key] = decodeURIComponent(value);
    });
    
    return result;
  }

  async postTweet(text: string, options?: {
    reply_to_status_id?: string;
    media_ids?: string[];
    possibly_sensitive?: boolean;
  // }): Promise<Record<string, unknown>> {
  }){
    // Prepare the data for the tweet
    const tweetData: RequestData = {
      status: text,
      ...options
    };

    console.log('x-- tweetData:', tweetData);
    
    
    try {
      // Make the API request to post the tweet
      return this.makeAuthenticatedRequest(
        'https://api.x.com/1.1/statuses/update.json',
        'POST',
        tweetData
      );
    } catch (error) {
      console.log('x --error:', error);
    }
  }
}