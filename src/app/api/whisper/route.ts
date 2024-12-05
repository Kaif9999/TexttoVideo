import { NextResponse } from "next/server";
import Replicate from "replicate";

// Initialize Replicate API client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "", // Add your Replicate API key here
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData(); // Get the form data from the request
    const audioFile = formData.get("audio") as File; // Extract the audio file

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required!" },
        { status: 400 }
      );
    }

    // Call the Replicate API to transcribe audio
    const transcriptionModel = "openai/whisper:8099696689d249cf8b122d833c36ac3f75505c666a395ca40ef26f68e7d3d16e"; // Replace with actual model ID for Whisper
    const transcriptionResponse = await replicate.run(transcriptionModel, {
      input: {
        audio: audioFile, // Pass the audio file to the model
      },
    });

    // Ensure the transcription response is structured correctly
    if (!transcriptionResponse || typeof transcriptionResponse !== 'object') {
      return NextResponse.json(
        { error: "Failed to transcribe audio." },
        { status: 500 }
      );
    }
    // console.log(transcriptionResponse)
    // Extract the transcription text from the response
    const transcriptionText = (transcriptionResponse as any).transcription; // Use 'any' to bypass type checking for this property

    if (!transcriptionText || typeof transcriptionText !== 'string') {
      return NextResponse.json(
        { error: "Transcription not found in the response." },
        { status: 500 }
      );
    }

    // Return the transcription result
    return NextResponse.json({
      transcription: transcriptionText, // The transcribed text
    });
  } catch (error) {
    console.error("Error while transcribing audio:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
