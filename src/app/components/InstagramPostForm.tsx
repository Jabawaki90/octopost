// components/InstagramPostForm.tsx
'use client';

import { useState } from 'react';

import { InstagramService } from '../../../lib/services/instagram';

interface InstagramPostFormProps {
  userId: string;
  accessToken: string;
}

export default function InstagramPostForm({ userId, accessToken }: InstagramPostFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      setMessage('Please select an image');
      return;
    }
    
    setIsPosting(true);
    setMessage('');
    
    try {
      // First upload the image to your server or a cloud service
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }
      
      const { imageUrl } = await uploadResponse.json();
      
      // Now post to Instagram using the public URL
      await InstagramService.postImage({
        imageUrl,
        caption,
        userId,
        accessToken
      });
      
      setMessage('Successfully posted to Instagram!');
      setImageFile(null);
      setImagePreview(null);
      setCaption('');
    } catch (error) {
      setMessage(`Error posting to Instagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsPosting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Post to Instagram</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </label>
          
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="w-full h-64 object-contain" />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Caption
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              rows={3}
            />
          </label>
        </div>
        
        <button
          type="submit"
          disabled={isPosting || !imageFile}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isPosting ? 'Posting...' : 'Post to Instagram'}
        </button>
        
        {message && (
          <div className={`mt-4 p-3 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}