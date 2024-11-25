import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lyrics, modelVersion, makeInstrumental, title } = body;

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
        model: "suno",
        task_type: "generate_music_custom",
        input: {
          prompt: lyrics,
          model_version: modelVersion || "chirp-v3-0",
          make_instrumental: makeInstrumental || false,
          title: title || "Generated Music",
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData?.message || "Failed to generate music." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const musicUrl = data?.data?.output?.musicUrl;

    if (!musicUrl) {
      return NextResponse.json(
        { error: "Music generation failed. No URL returned." },
        { status: 500 }
      );
    }

    return NextResponse.json({ musicUrl });
  } catch (error) {
    console.error("Error in /api/suno:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
