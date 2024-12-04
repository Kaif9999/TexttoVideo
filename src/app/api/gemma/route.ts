import { NextResponse } from "next/server";
import Replicate from "replicate";

// Initialize Replicate API client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "", // Add your Replicate API key here
});

interface RequestBody {
  prompt: string;
  action: string; // You can further restrict this to specific actions if needed
}

export async function POST(req: Request) {
  try {
    const { prompt, action }: RequestBody = await req.json(); // Added type definition

    // Validate input
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required!" },
        { status: 400 }
      );
    }

    // Check action type
    const validActions = ["generateLyrics"]; // Define valid actions
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: "Invalid action provided!" },
        { status: 400 }
      );
    }

    if (action === "generateLyrics") {
      const lyricsModel =
        "google-deepmind/gemma-2b-it:dff94eaf770e1fc211e425a50b51baa8e4cac6c39ef074681f9e39d778773626"; // Replace with actual model ID for generating lyrics

      // Call the Replicate API to generate lyrics
      const lyrics = await replicate.run(lyricsModel, {
        input: {
          prompt: `Write song lyrics based on the following idea in not more than 200 words: "${prompt}"`,
        },
      });

      console.log(lyrics);
      if (!lyrics || !Array.isArray(lyrics)) {
        return NextResponse.json(
          { error: "Failed to generate lyrics." },
          { status: 500 }
        );
      }

      // Convert lyrics array to a single string
      const lyricsString = lyrics.join("\n");

      // Return both generated lyrics and music URL
      return NextResponse.json({
        message: "Lyrics and music generated successfully!",
        lyrics: lyrics, // The generated lyrics as a string
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
