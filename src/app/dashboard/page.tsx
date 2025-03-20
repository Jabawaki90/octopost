// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import Link from 'next/link';
import InstagramPostForm from '../components/InstagramPostForm';

// In a real application, you would fetch this data from your database
// This is just a placeholder
async function getUserInstagramData() {
  // Example database query with Prisma:
  // return prisma.user.findUnique({
  //   where: { id: userId },
  //   select: { instagramUserId: true, instagramAccessToken: true }
  // });
  
  // Placeholder data
  const cookie = await cookies()
  console.log('x-- cookie:', cookie);
  
  return {
    instagramUserId: '123456789',
    instagramAccessToken: 'placeholder-token',
    isConnected: true // Flag to check if Instagram is connected
  };
}

export default async function DashboardPage() {
  const userData = await getUserInstagramData();
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {userData.isConnected ? (
        <div className="space-y-8">
          <div className="bg-green-100 p-4 rounded-md">
            <p className="text-green-800">
              Your Instagram account is connected! You can post images directly to Instagram.
            </p>
          </div>
          
          <InstagramPostForm 
            // userId={userData.instagramUserId} 
            // accessToken={userData.instagramAccessToken}
          />
        </div>
      ) : (
        <div className="bg-yellow-100 p-6 rounded-md">
          <p className="text-yellow-800 mb-4">
            `You havent connected your Instagram account yet. Connect now to start posting images.`
          </p>
          <Link href="/instagram-login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Connect Instagram
          </Link>
        </div>
      )}
    </div>
  );
}