import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('instagram_access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;
    const caption = formData.get('caption') as string;

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // First, upload the image to get a container ID
    const mediaResponse = await axios.post('https://graph.instagram.com/me/media', {
      image_url: image, // You'll need to upload the image to a public URL first
      caption: caption,
      access_token: accessToken
    });

    const creationId = mediaResponse.data.id;

    // Then publish the container
    const publishResponse = await axios.post(`https://graph.instagram.com/me/media_publish`, {
      creation_id: creationId,
      access_token: accessToken
    });
    return NextResponse.json(publishResponse.data);
  } catch (error: unknown) {
    console.error('Error posting to Instagram:', (error as Error).message || error);
    return NextResponse.json(
      { error: 'Failed to post to Instagram', details: (error as Error).message },
      { status: 500 }
    );
  }
} 