// app/instagram-success/page.tsx
import { Suspense } from 'react';
import InstagramSuccessClient from './client';

export default function InstagramSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InstagramSuccessClient />
    </Suspense>
  );
}