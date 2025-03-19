// import fetch from 'node-fetch';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest): Promise<NextResponse> {
//   const accessToken = request.cookies.get('x_access_token')?.value;

//   // Check for authentication
//   if (!accessToken) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const { tweet }: { tweet: string } = await request.json();
//   if (!tweet) {
//     return NextResponse.json({ error: 'Missing tweet content' }, { status: 400 });
//   }

//   const tweetUrl = 'https://api.x.com/2/tweets';
//   const response = await fetch(tweetUrl, {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${accessToken}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ text: tweet }),
//   });

//   if (!response.ok) {
//     const error: { message: string } = await response.json() as { message: string };
//     console.error('Failed to post tweet:', error);
//     return NextResponse.json({ error: 'Failed to post tweet', details: error }, { status: response.status });
//   }

//   interface TweetResponse {
//     id: string;
//     text: string;
//     createdAt: string;
//   }

//   const data: TweetResponse = await response.json() as TweetResponse;
//   return NextResponse.json(data, { status: 200 });
// }