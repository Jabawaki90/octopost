import XLoginButton from "./components/XLoginButton";
import { generatePkceCodes } from "../../lib/pkce";

// Function to initiate login
const handleLogin = async () => {
  const { code_verifier, code_challenge } = await generatePkceCodes();

  // Store code_verifier in a secure cookie
  document.cookie = `code_verifier=${code_verifier}; HttpOnly; Secure`;

  // Construct the authorization URL
  const authUrl = `https://x.com/i/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent('https://your-app.vercel.app/api/auth/callback')}&scope=tweet.read%20tweet.write%20users.read&state=state123&code_challenge=${code_challenge}&code_challenge_method=S256`;

  // Redirect the user
  window.location.href = authUrl;
};

// Example usage in a component
<button onClick={handleLogin}>Login with X</button>
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <XLoginButton/>
      <button onClick={handleLogin}>Login with X</button>
    </div>
  );
}
