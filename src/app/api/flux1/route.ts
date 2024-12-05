import { NextResponse } from "next/server";
import Replicate from "replicate";
import { writeFile } from "node:fs/promises";
import path from "path";

// Initialize Replicate API client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "", // Add your Replicate API key here
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json(); // Get the text input from the request body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: "Text input is required!" },
        { status: 400 }
      );
    }

    const input = {
      prompt: text, // Use the transcribed text as the prompt
    };

    // Call the Replicate API to generate images based on the text
    const output = await replicate.run("black-forest-labs/flux-dev-lora", { input });

    // Prepare an array to hold the file paths of the saved images
    const imagePaths = [];

    // Save each image to disk
    for (const [index, item] of Object.entries(output)) {
      const filePath = path.join(process.cwd(), `public/output_${index}.webp`); // Save to the public directory
      await writeFile(filePath, item);
      imagePaths.push(`/output_${index}.webp`); // Store the relative path for frontend access
    }

    // Return the generated image URLs
    return NextResponse.json({
      imageUrls: imagePaths, // Array of image URLs
    });
  } catch (error) {
    console.error("Error while generating images:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
