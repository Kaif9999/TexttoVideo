"use client";
import React, { useState } from "react";

const InputPrompt: React.FC = () => {
  const [prompt, setPrompt] = useState(""); // Stores the user's input
  const [lyrics, setLyrics] = useState(""); // Stores the generated lyrics
  const [loadingLyrics, setLoadingLyrics] = useState(false); // Tracks loading state for lyrics
  const [loadingMusic, setLoadingMusic] = useState(false); // Tracks loading state for music
  const [musicUrl, setMusicUrl] = useState(""); // Stores the URL of the generated music

  // Function to generate lyrics from the prompt
  const handleGenerateLyrics = async () => {
    if (!prompt) {
      alert("Please enter a prompt!");
      return;
    }

    setLoadingLyrics(true);
    setLyrics(""); // Clear previous lyrics
    setMusicUrl(""); // Clear previous music

    try {
      const res = await fetch("/api/whisper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, action: "generateLyrics" }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        setLyrics(data.lyrics); // Update lyrics in state
        // Automatically generate music once lyrics are generated
        handleGenerateMusic(data.lyrics);
      }
    } catch (error) {
      console.error("Error generating lyrics:", error);
      alert("An error occurred while generating lyrics. Please try again.");
    } finally {
      setLoadingLyrics(false);
    }
  };

  // Function to generate music from the lyrics
  const handleGenerateMusic = async (generatedLyrics: string) => {
    if (!generatedLyrics) {
      alert("Lyrics must be generated first!");
      return;
    }

    setLoadingMusic(true);
    setMusicUrl(""); // Clear previous music

    try {
      const res = await fetch("/api/whisper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lyrics: generatedLyrics, action: "generateMusic" }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        setMusicUrl(data.musicUrl); // Update music URL in state
      }
    } catch (error) {
      console.error("Error generating music:", error);
      alert("An error occurred while generating music. Please try again.");
    } finally {
      setLoadingMusic(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md mt-6 p-6 relative max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 text-center mb-6">
        Prompt to Lyrics and Music Generator
      </h1>

      {/* Input field for prompt */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Enter a prompt for your song:
      </label>
      <textarea
        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Generate lyrics button */}
      <button
        onClick={handleGenerateLyrics}
        disabled={loadingLyrics}
        className={`mt-4 w-full py-2 px-4 rounded-lg font-bold text-white ${
          loadingLyrics ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 transition duration-200"
        }`}
      >
        {loadingLyrics ? "Generating Lyrics..." : "Generate Lyrics"}
      </button>

      {/* Display generated lyrics */}
      {lyrics && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Generated Lyrics:</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{lyrics}</p>
        </div>
      )}

      {/* Display music player */}
      {musicUrl && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Generated Music:</h3>
          <audio
            controls
            src={musicUrl}
            className="w-full rounded-lg"
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default InputPrompt;
