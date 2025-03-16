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
type RequestData = Record<string, string | number | boolean>;

export class XAuth {
  private oauth: OAuth;
  private credentials: XAuthCredentials;
  
  constructor(credentials: XAuthCredentials) {
    this.credentials = credentials;
    
    // Initialize OAuth
    this.oauth = new OAuth({
      consumer: {
        key: credentials.apiKey,
        secret: credentials.apiSecretKey
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
        throw new Error(`Failed to get request token: ${response.status} ${response.statusText}`);
      }

      const responseText = await response.text();
      const parsedResponse = this.parseResponseText(responseText);
      
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
}