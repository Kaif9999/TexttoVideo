
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import Replicate from "replicate";
import fetch from "node-fetch";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";

// Configure FFmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic || "");

// Initialize Replicate API client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "",
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const text = formData.get("text") as string;

    if (!audioFile || !text) {
      return NextResponse.json(
        { error: "Audio file and text are required!" },
        { status: 400 }
      );
    }

    // Call Replicate API to generate images
    const images = await replicate.run("black-forest-labs/flux-dev-lora", {
      input: { prompt: text },
    });

    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("Failed to generate images from flux module.");
    }

    // Download images locally
    const imageDir = path.join(process.cwd(), "tmp", "images");
    fs.mkdirSync(imageDir, { recursive: true });
    for (let i = 0; i < images.length; i++) {
      const response = await fetch(images[i]);
      if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${images[i]}`);
      }
      const imageArrayBuffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);
      fs.writeFileSync(path.join(imageDir, `frame-${String(i + 1).padStart(3, "0")}.png`), imageBuffer);
    }

    // Save audio file locally
    const audioBuffer = await audioFile.arrayBuffer();
    const audioPath = path.join(process.cwd(), "tmp", "audio.mp3");
    fs.writeFileSync(audioPath, Buffer.from(audioBuffer));

    // Generate video
    const videoPath = path.join(process.cwd(), "tmp", "video.mp4");
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(`${imageDir}/frame-%03d.png`)
        .inputOptions(["-framerate", "10"]) // Adjust frame rate as needed
        .input(audioPath)
        .videoCodec("libx264")
        .outputOptions(["-pix_fmt", "yuv420p", "-shortest"]) // Use `-shortest` to align audio and video length
        .save(videoPath)
        
        .on("error", reject);
    });

    // Upload video to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(videoPath, {
      resource_type: "video",
      folder: "generated-videos",
    });

    if (!uploadResult?.secure_url) {
      throw new Error("Failed to upload video to Cloudinary.");
    }

    // Cleanup local files
    fs.rmSync(path.join(process.cwd(), "tmp"), { recursive: true, force: true });

    // Return video URL to frontend
    return NextResponse.json({
      videoUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Error during video generation:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
