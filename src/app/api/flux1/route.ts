import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import fetch from "node-fetch";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text input is required!" },
        { status: 400 }
      );
    }

    const input = { prompt: text };

    const output = await replicate.run("black-forest-labs/flux-dev-lora", {
      input,
    });

    if (!Array.isArray(output) || output.length === 0) {
      return NextResponse.json(
        { error: "No images generated by the API." },
        { status: 500 }
      );
    }

    const cloudinaryUrls: string[] = [];

    for (const [index, url] of output.entries()) {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch image from ${url}`);
      }

      const imageBuffer = await response.arrayBuffer();

      // Upload the image buffer to Cloudinary
      const result = await cloudinary.uploader.upload_stream({
        folder: "generated-images",
        public_id: `output_${index}`,
        format: "webp",
      },
      (error, result) => {
        if (error) throw new Error("Failed to upload to Cloudinary.");
        return result.secure_url;
      });

      cloudinaryUrls.push(result.secure_url);
    }

    return NextResponse.json({
      imageUrls: cloudinaryUrls,
    });
  } catch (error) {
    console.error("Error while generating or uploading images:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
