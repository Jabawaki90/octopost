// lib/services/instagram.ts
import axios from 'axios';

export interface InstagramPostParams {
  imageUrl: string;
  caption?: string;
  userId: string;
  accessToken: string;
}

export class InstagramService {
  /**
   * Posts an image to Instagram
   * Note: This requires a Facebook Page connected to the Instagram Business Account
   */
  static async postImage({ imageUrl, caption, userId, accessToken }: InstagramPostParams) {
    try {
      // 1. First, get the Instagram Business Account ID linked to the user
      const accountResponse = await axios.get(`https://graph.facebook.com/v19.0/${userId}/accounts`, {
        params: { access_token: accessToken }
      });
      
      const pageId = accountResponse.data.data[0]?.id;
      
      if (!pageId) {
        throw new Error('No Facebook page found for this user');
      }
      
      // 2. Get the Instagram Business Account ID
      const igAccountResponse = await axios.get(`https://graph.facebook.com/v19.0/${pageId}`, {
        params: {
          fields: 'instagram_business_account',
          access_token: accessToken
        }
      });
      
      const igBusinessId = igAccountResponse.data.instagram_business_account.id;
      
      if (!igBusinessId) {
        throw new Error('No Instagram Business Account found');
      }
      
      // 3. Create a container for the media
      const containerResponse = await axios.post(
        `https://graph.facebook.com/v19.0/${igBusinessId}/media`,
        null,
        {
          params: {
            image_url: imageUrl,
            caption: caption || '',
            access_token: accessToken
          }
        }
      );
      
      const containerId = containerResponse.data.id;
      
      // 4. Publish the media
      const publishResponse = await axios.post(
        `https://graph.facebook.com/v19.0/${igBusinessId}/media_publish`,
        null,
        {
          params: {
            creation_id: containerId,
            access_token: accessToken
          }
        }
      );
      
      return publishResponse.data;
    } catch (error) {
      console.error('Error posting to Instagram:', error);
      throw error;
    }
  }
  
  /**
   * Refresh the long-lived access token (should be done before it expires)
   */
  static async refreshAccessToken(accessToken: string) {
    try {
      const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
        params: {
          grant_type: 'ig_refresh_token',
          access_token: accessToken
        }
      });
      
      return response.data.access_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }
}