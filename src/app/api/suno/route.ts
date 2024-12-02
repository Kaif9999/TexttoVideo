import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { lyrics } = await req.json();

    if (!lyrics) {
      return NextResponse.json(
        { error: "Lyrics are required to generate music." },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.piapi.ai/api/v1/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.PIAPI_API_KEY || "",
      },
      body: JSON.stringify({
        model: "music-u",
        task_type: "music_generation",
        input: {
          prompt: lyrics,
          lyrics_type: "instrumental",
          seed: Math.floor(Math.random() * 1000000000), // Random seed for diversity
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.data?.output?.musicUrl) {
      return NextResponse.json(
        { error: "Failed to generate music." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Music generated successfully!",
      musicUrl: data.data.output.musicUrl,
    });
  } catch (error) {
    console.error("Error in /api/suno:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
