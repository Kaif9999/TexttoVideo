"use client"
import React from "react";

export default function MusicVideoPlayer() {
  const handleDownload = () => {
    // Logic to start the video download
    console.log("Video download started!");
  };

  return (
    <div className="bg-white shadow-md rounded-md mt-3 mx-6 p-4">
      <label className="flex text-sm font-medium text-gray-700">
        Complete Music Video
      </label>
      <div className="mt-2">
        <video
          className="w-full h-auto rounded-lg"
          controls
          src="path_to_your_music_video.mp4" // Replace with your video source
        />
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Download Video
      </button>
    </div>
  );
}