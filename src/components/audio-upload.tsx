"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, ImageIcon, AudioWaveformIcon as Waveform } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const AudioUpload = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setError("");
    } else {
      setError("Please upload a valid audio file.");
    }
  };

  const handleUpload = async () => {
    if (!audioFile) {
      setError("Please select an audio file to upload.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const response = await fetch("/api/whisper", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio.");
      }

      const data = await response.json();
      console.log(data);

      if (data && data.transcription) {
        setTranscription(data.transcription);
      } else {
        setError("Transcription not found in the response.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!transcription) {
      setError("No transcription available to generate an image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const imageResponse = await fetch("/api/flux1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: transcription }),
      });

      if (!imageResponse.ok) {
        throw new Error("Failed to generate images.");
      }

      const imageData = await imageResponse.json();
      if (imageData && imageData.imageUrls) {
        setImageUrls(imageData.imageUrls);
      } else {
        setError("Image generation failed.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-800 text-gray-100 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Audio Transcription & Image Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            className="flex items-center justify-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label
              htmlFor="audio-upload"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-700 border-gray-600 hover:border-blue-500 hover:bg-gray-600 transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">Audio files (MP3, WAV, etc.)</p>
              </div>
              <Input
                id="audio-upload"
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </motion.div>
          <AnimatePresence>
            {audioFile && (
              <motion.p
                className="text-sm text-gray-400 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                Selected file: {audioFile.name}
              </motion.p>
            )}
          </AnimatePresence>
          {error && (
            <motion.p
              className="text-red-400 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
          <Button
            onClick={handleUpload}
            disabled={loading || !audioFile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transcribing...
              </>
            ) : (
              <>
                <Waveform className="mr-2 h-4 w-4" />
                Transcribe Audio
              </>
            )}
          </Button>
          <AnimatePresence>
            {transcription && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Textarea
                  value={transcription}
                  readOnly
                  className="min-h-[100px] resize-none bg-gray-700 text-gray-100 border-gray-600"
                  placeholder="Transcription will appear here..."
                />
                <Button
                  onClick={handleGenerateImage}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Image...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Generate Image
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-center gap-4">
          <AnimatePresence>
            {imageUrls.map((url, index) => (
              <motion.img
                key={index}
                src={url}
                alt={`Generated based on transcription ${index + 1}`}
                className="max-w-full h-auto rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            ))}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AudioUpload;

