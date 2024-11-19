"use client"
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`fixed bg-white rounded-md top-0 left-0 h-[calc(100%-2rem)] m-4 shadow-lg ${isOpen ? "w-64" : "w-16"} transition-width duration-300 
      shadow-2xl`}>
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">New project</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500">
          {isOpen ? "←" : "→"}
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          <li className="flex items-center p-2 hover:bg-gray-100">
            <span className="material-icons">text_fields</span>
            {isOpen && <span className="ml-2">Text-based</span>}
          </li>
          <li className="flex items-center p-2 hover:bg-gray-100">
            <span className="material-icons">audiotrack</span>
            {isOpen && <span className="ml-2">Audio-based</span>}
          </li>
          <li className="flex items-center p-2 hover:bg-gray-100">
            <span className="material-icons">music_video</span>
            {isOpen && <span className="ml-2">Music to Video</span>}
            {isOpen && <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-1 rounded-full">New</span>}
          </li>
          <li className="flex items-center p-2 hover:bg-gray-100">
            <span className="material-icons">videocam</span>
            {isOpen && <span className="ml-2">Video-based</span>}
            {isOpen && <span className="ml-auto text-xs text-gray-400">Soon</span>}
          </li>
          <li className="flex items-center p-2 hover:bg-gray-100">
            <span className="material-icons">share</span>
            {isOpen && <span className="ml-2">Social Media-based</span>}
            {isOpen && <span className="ml-auto text-xs text-gray-400">Soon</span>}
          </li>
          <li className="flex items-center p-2 hover:bg-gray-100">
            <span className="material-icons">web</span>
            {isOpen && <span className="ml-2">Web-based</span>}
            {isOpen && <span className="ml-auto text-xs text-gray-400">Soon</span>}
          </li>
        </ul>
      </nav>
    </div>
  );
}