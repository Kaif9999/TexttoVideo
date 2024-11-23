import React from "react";

export default function TopBar() {
  return (
    <header className="bg-blue-600 text-white w-full mt-3 mx-0 sm:mx-6 shadow-md rounded-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center justify-center">Text to Video</h1>
        {/* Add additional navigation items or buttons here if needed */}
      </div>
    </header>
  );
}