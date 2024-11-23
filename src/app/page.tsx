import React from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AspectRatioSelector from "@/components/AspectRatioSelector";
import LyricsAndTranscript from "@/components/lyricsandtranscript";
import MusicVideoPlayer from "@/components/MusicVideoPlayer";
import InputPrompt from "../components/Input";

function App() {
  return (
    <div className="flex flex-col sm:flex-row">
      <div className="hidden lg:block">

      <Sidebar />
      </div>
      <div className="flex-1 ml-0 sm:ml-64">
        <TopBar />
        <main className="p-4">
          <InputPrompt />
          {/* <AspectRatioSelector /> */}
          <LyricsAndTranscript />
          <MusicVideoPlayer />
        </main>
      </div>
    </div>
  );
}

export default App;