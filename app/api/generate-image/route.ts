import { NextResponse } from 'next/server';
import * as fal from "@fal-ai/serverless-client";

fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(request: Request) {
  const { prompt, image_size = "landscape_4_3" } = await request.json();

  if (!process.env.FAL_KEY) {
    return NextResponse.json({ error: 'FAL_KEY is not set in environment variables' }, { status: 500 });
  }

  try {
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt,
        image_size,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image. Please try again.' }, { status: 500 });
  }
}