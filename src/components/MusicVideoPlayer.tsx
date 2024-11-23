"use client";

import React, { useState } from "react";

export default function MusicVideoPlayer() {
  const [videoUrl, setVideoUrl] = useState("");

  const fetchVideo = async () => {
    try {
      const res = await fetch("/api/whisper/video");
      if (!res.ok) {
        throw new Error("Failed to fetch video");
      }

      const data = await res.json();
      setVideoUrl(data.videoUrl || ""); // Assuming API returns `videoUrl`
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
    }
  };

  return (
    <div className="mt-4">
      <label className="text-sm font-medium text-gray-700">
        Music Video Preview:
      </label>
      <div className="mt-2">
        <video
          className="w-full h-auto rounded-lg"
          controls
          src={videoUrl || ""}
        />
      </div>
      <button
        onClick={fetchVideo}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
      >
        Fetch Video
      </button>
    </div>
  );
}
