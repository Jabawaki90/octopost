// app/api/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // In Next.js 15, form data is handled differently
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }
    
    // Get file extension
    const buffer = await file.arrayBuffer();
    const fileExtension = extname(file.name) || '.jpg';
    const fileName = `${uuidv4()}${fileExtension}`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, continue
      console.log('x-- error:', error);
      
    }
    
    const filePath = join(uploadDir, fileName);
    
    // Write the file
    await writeFile(filePath, Buffer.from(buffer));
    
    // Create public URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://yourdomain.com' 
      : 'http://localhost:3000';
    
    const imageUrl = `${baseUrl}/uploads/${fileName}`;
    
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

// Set the maximum file size
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};