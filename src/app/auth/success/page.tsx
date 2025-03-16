
// 6. Create a success page - app/auth/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Define a proper interface for X user data
interface XUserData {
    id_str: string;
    name: string;
    screen_name: string;
    profile_image_url_https?: string;
    description?: string;
    followers_count?: number;
    friends_count?: number;
    // Add other fields you expect from the X API as needed
  }

export default function AuthSuccess() {
  const [userData, setUserData] = useState<XUserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // You could fetch user data from X API here using the access token
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Authentication Successful!</h1>
      
      {loading ? (
        <p>Loading your profile information...</p>
      ) : userData ? (
        <div>
          <p>Welcome, {userData.name}!</p>
          <p>You have successfully connected your X account.</p>
        </div>
      ) : (
        <p>`Your X account has been connected, but we couldnt load your profile information.`</p>
      )}
      
      <Link href="/" className="block mt-4 text-blue-600 hover:underline">
        Return to Home
      </Link>
    </div>
  );
}