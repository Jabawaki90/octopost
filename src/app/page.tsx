

import { TweetForm } from "./components/TweetForm";
import XLoginButton from "./components/XLoginButton";


import { cookies } from 'next/headers';

export default async function Home() {

  const cookie = await cookies()
  const accessToken = cookie.get('x_access_token')?.value ?? '';
  const accessTokenSecret = cookie.get('x_access_token_secret')?.value ?? '';
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <XLoginButton/>
      <TweetForm  accessToken={accessToken} accessTokenSecret={accessTokenSecret}/> 
    </div>
  );
}
