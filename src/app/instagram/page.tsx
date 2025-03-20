import { cookies } from 'next/headers';
import InstagramLoginButton from '../components/InstagramLoginButton';
import InstagramPostForm from '../components/InstagramPostForm';

export default async function InstagramPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('instagram_access_token')?.value;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Instagram Integration</h1>
      
      {!accessToken ? (
        <div className="text-center">
          <p className="mb-4">Connect your Instagram account to start posting</p>
          <InstagramLoginButton />
        </div>
      ) : (
        <InstagramPostForm />
      )}
    </div>
  );
} 