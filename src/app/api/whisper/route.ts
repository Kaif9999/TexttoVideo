import { NextResponse } from "next/server";
import Replicate from "replicate";

// Initialize Replicate API client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "", // Add your Replicate API key here
});

export async function POST(req: Request) {
  try {
    const { prompt, action } = await req.json();

    // Validate input
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required!" },
        { status: 400 }
      );
    }

    // Check action type
    if (action === "generateLyrics") {
      const model = "google-deepmind/gemma-2b-it:dff94eaf770e1fc211e425a50b51baa8e4cac6c39ef074681f9e39d778773626"; // Replace with actual model ID for generating lyrics

      // Call the Replicate API to generate lyrics
      const lyrics = await replicate.run(model, {
        input: {
          prompt: `Write song lyrics based on the following idea in not more than 200 words: "${prompt}"`,
        },
      });

      // Once lyrics are generated, use them to generate music
      const musicModel = "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb"; // Replace with actual Suno AI model for music generation

      // Call Suno AI API to generate music based on the lyrics
      const music = await replicate.run(musicModel, {
        input: {
          lyrics: lyrics, // Pass the generated lyrics as input for music generation
        },
      });

      // Return both generated lyrics and music URL (assuming the music generation API returns a URL)
      return NextResponse.json({
        message: "Lyrics and music generated successfully!",
        lyrics: lyrics, // The generated lyrics
        musicUrl: music, // Assuming the music model returns a URL to the generated music
      });
    }

    return NextResponse.json(
      { error: "Invalid action provided!" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error while generating lyrics and music:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
