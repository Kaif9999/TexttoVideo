import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "",
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
      const model = "google-deepmind/gemma-2b-it:dff94eaf770e1fc211e425a50b51baa8e4cac6c39ef074681f9e39d778773626"; // Replace with actual Replicate model ID

      // Call the Replicate API to generate lyrics
      const output = await replicate.run(model, {
        input: {
          prompt: `Write song lyrics based on the following idea: "${prompt}"`,
        },
      });

      // Handle output and return lyrics
      return NextResponse.json({
        message: "Lyrics generated successfully!",
        lyrics: output, // Assuming model returns usable lyrics
      });
    }

    return NextResponse.json(
      { error: "Invalid action provided!" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error while generating lyrics:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
