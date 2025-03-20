'use client';

export default function InstagramLoginButton() {
  const handleInstagramLogin = async () => {
    try {
      const response = await fetch('/api/auth/instagram');
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        console.error('Failed to initiate Instagram login');
      }
    } catch (error) {
      console.error('Error during Instagram login:', error);
    }
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