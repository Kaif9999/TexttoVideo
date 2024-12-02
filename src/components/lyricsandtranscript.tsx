"use client"

import React, { useState } from "react";

export default function LyricsAndTranscript() {
  const [transcript, setTranscript] = useState("");

  const fetchTranscript = async () => {
    try {
      const res = await fetch("/api/whisper/transcript");
      if (!res.ok) {
        throw new Error("Failed to fetch transcript");
      }

      const data = await res.json();
      setTranscript(data.transcript || "No transcript found."); // Assuming API returns `transcript`
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
      setTranscript("Error occurred while fetching transcript.");
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col items-start space-y-4">
        <button
          onClick={fetchTranscript}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
        >
          Fetch Transcript
        </button>
        <textarea
          className="w-full h-32 p-3 border rounded-lg resize-none"
          readOnly
          value={transcript}
          placeholder="Transcript will appear here..."
        />
      </div>
    </div>
  );
}
