// 4. Create a page that includes the tweet form
// app/tweet/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import TweetForm from '../components/TweetForm';


export default function TweetPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
            console.log('x-- response:', response);
            
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginClick = () => {
    router.push('/api/auth/x');
  };

//   const handleTweetSuccess = () => {
//     setSuccessMessage('Your tweet was posted successfully!');
    
//     // Clear success message after 5 seconds
//     setTimeout(() => {
//       setSuccessMessage(null);
//     }, 5000);
//   };

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tweet from Your App</h1>
      
      {isAuthenticated ? (
        <>
          {/* {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )} */}
          
          {/* <TweetForm onSuccess={handleTweetSuccess} /> */}
        </>
      ) : (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="mb-4">You need to connect your X account to post tweets.</p>
          <button
            onClick={handleLoginClick}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Connect X Account
          </button>
        </div>
      )}
    </div>
  );
}