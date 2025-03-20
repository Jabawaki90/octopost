'use client';

export default function InstagramLoginButton() {
  const handleInstagramLogin = () => {
    const INSTAGRAM_APP_ID = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
    const REDIRECT_URI = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/instagram`
    );
    const INSTAGRAM_AUTH_URL = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;

    window.location.href = INSTAGRAM_AUTH_URL;
  };

  return (
    <button
      onClick={handleInstagramLogin}
      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
    >
      Connect Instagram
    </button>
  );
} 