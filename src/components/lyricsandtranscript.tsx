"use client"
import React from "react";

export default function LyricsAndTranscript() {
  const handleDownload = () => {
    // Logic to start the music download
    console.log("Download started!");
  };

  return (
    <div className="mt-3 mx-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Column for Download Button */}
        <div className="bg-white shadow-md rounded-md p-4 flex items-center justify-center">
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <span className="text-2xl">⬇️</span> Download Music
          </button>
        </div>

        {/* Column for Transcript Display */}
        <div className="bg-white shadow-md rounded-md p-4">
          <label className="flex text-sm font-medium text-gray-700">
            Music Transcript
          </label>
          <textarea
            className="mt-1 w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Transcript will appear here..."
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
