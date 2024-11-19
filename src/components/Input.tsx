import React from "react";

export default function TextInput() {
  return (
    <div className="bg-white shadow-md rounded-md mt-3 mx-6 p-4 relative">
      <label className="flex text-sm font-medium text-gray-700">
        Enter your Prompt to generate music video
      </label>
      <textarea
        className="mt-1 w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your prompt here..."
        rows={10}
      />
    </div>
  );
}
