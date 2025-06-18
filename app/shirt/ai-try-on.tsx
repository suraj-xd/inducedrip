"use client";

import { useState, ChangeEvent, useRef } from "react";
import { Upload, X, Loader2, FileText, Trash2, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useAiTryonStore } from "@/lib/stores/ai-tryon-store";
import { motion, AnimatePresence } from "framer-motion";

interface AiTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export default function AiTryOn({ isOpen, onClose, imageUrl }: AiTryOnProps) {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addGeneration, updateGeneration } = useAiTryonStore();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setUserImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setUserImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setError(null);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setUserImage(null);
    setUserImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!userImage) {
      setError("Please upload your photo to continue.");
      return;
    }

    setError(null);

    // Create data URLs for the store
    const userImageUrl = userImagePreview!;
    
    // Create abort controller for cancellation
    const abortController = new AbortController();

    // Add generation to store
    const generationId = addGeneration({
      status: 'generating',
      userImageUrl,
      clothingImageUrl: imageUrl,
      abortController,
    });

    // Close the dialog since generation is now handled by notifications
    handleClose();

    const formData = new FormData();
    formData.append("userImage", userImage);

    // Use the imageUrl prop for the clothing image
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const clothingFile = new File(
        [blob],
        "clothing-item.jpg",
        { type: "image/jpeg" }
      );
      formData.append("clothingImage", clothingFile);
    } catch (err) {
      updateGeneration(generationId, {
        status: 'failed',
        error: "Failed to load clothing image.",
        abortController: undefined,
      });
      return;
    }

    try {
      const response = await fetch("/api/tryon", {
        method: "POST",
        body: formData,
        signal: abortController.signal,
      });

      if (abortController.signal.aborted) {
        return; // Request was cancelled
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `API Error: ${response.statusText}`);
      }

      if (result.image) {
        updateGeneration(generationId, {
          status: 'completed',
          resultImageUrl: result.image,
          abortController: undefined,
        });
      } else {
        throw new Error("API did not return a generated image URL.");
      }
    } catch (err: unknown) {
      if (abortController.signal.aborted) {
        return; // Request was cancelled
      }
      
      console.error("Submission Error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred during image generation.";
      
      updateGeneration(generationId, {
        status: 'failed',
        error: errorMessage,
        abortController: undefined,
      });
    }
  };

  const handleReset = () => {
    setUserImage(null);
    setUserImagePreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const dialogVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0
    }
  };

  const dialogTransition = {
    type: "spring",
    damping: 25,
    stiffness: 300,
    duration: 0.3
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          />

          {/* Dialog */}
          <motion.div
            className="relative w-[90%] max-w-xl max-h-[98vh] bg-white rounded-lg shadow-2xl overflow-hidden"
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={dialogTransition}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 py-2 border-b">
              <h2 className="text-lg font-semibold">AI Virtual Try-On</h2>
              <motion.button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} className="text-gray-500" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 py-2 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Instructions */}
                <div className="flex flex-row gap-2 items-center text-sm text-gray-600 mb-4">
                  Upload your photo to see how this item looks on you! Results will appear in notifications.
                </div>

                {/* File input */}
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                />

                {/* Drop area */}
                <motion.div
                  className={`relative h-48 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : userImage
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={!userImage ? handleClick : undefined}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  {userImage ? (
                    <div className="flex h-full flex-col items-center justify-center p-4">
                      <FileText className="h-8 w-8 text-green-500 mb-2" />
                      <p className="text-sm font-medium text-center">
                        {userImage.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round(userImage.size / 1024)} KB
                      </p>
                      <div className="flex gap-2 mt-4">
                        <motion.button
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Replace
                        </motion.button>
                        <motion.button
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove();
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-4">
                      <div className="rounded-full bg-white p-3 shadow-sm mb-3">
                        <Upload className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium">Click to select</p>
                      <p className="text-xs text-gray-500">
                        or drag and drop your photo here
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, or WEBP up to 10MB
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Preview of clothing item */}
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-gray-700 mb-2">Trying on:</p>
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imageUrl}
                      alt="Clothing item"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="p-3 bg-red-50 border border-red-200 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-red-600">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4">
              <div className="flex gap-3 justify-end">
                <motion.button
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={!userImage}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  whileHover={{ scale: !userImage ? 1 : 1.05 }}
                  whileTap={{ scale: !userImage ? 1 : 0.95 }}
                >
                  <Upload className="h-4 w-4" />
                  Start Generation
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
