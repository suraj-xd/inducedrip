"use client";

import { useState, ChangeEvent, useRef } from "react";
import { Upload, X, Loader2, FileText, Trash2, RefreshCw } from "lucide-react";
import { IconUpload } from "@tabler/icons-react";
import Image from "next/image";
import { useAiTryonStore } from "@/lib/stores/ai-tryon-store";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}

interface AiTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export default function AiTryOn({ isOpen, onClose, imageUrl }: AiTryOnProps) {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addGeneration, updateGeneration } = useAiTryonStore();

  const handleFileChange = (newFiles: File[]) => {
    const file = newFiles[0];
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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileChange([file]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
      setError("Please upload a valid image file (PNG, JPG, JPEG, or WEBP).");
    },
  });

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
      status: "generating",
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
      const clothingFile = new File([blob], "clothing-item.jpg", {
        type: "image/jpeg",
      });
      formData.append("clothingImage", clothingFile);
    } catch (err) {
      updateGeneration(generationId, {
        status: "failed",
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
          status: "completed",
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
        status: "failed",
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
    visible: { opacity: 1 },
  };

  const dialogVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  const dialogTransition = {
    type: "spring",
    damping: 25,
    stiffness: 300,
    duration: 0.3,
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
              <h2 className="text-lg font-semibold font-ppMondwest">
                AI Virtual Try-On
              </h2>
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
              <div className="">
                {/* File input */}
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleInputChange}
                />

                {/* Modern File Upload Area */}
                <div className="w-full" {...getRootProps()}>
                  <motion.div
                    onClick={handleClick}
                    whileHover="animate"
                    className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
                  >
                    <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                      <GridPattern />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
                        Upload your photo
                      </p>
                      <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
                        Drag or drop your photo here or click to upload
                      </p>
                      <div className="relative w-full mt-10 max-w-xl mx-auto">
                        {userImage && (
                          <motion.div
                            layoutId="file-upload"
                            className={cn(
                              "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                              "shadow-sm"
                            )}
                          >
                            <div className="flex justify-between w-full items-center gap-4">
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                layout
                                className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                              >
                                {userImage.name}
                              </motion.p>
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                layout
                                className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                              >
                                {(userImage.size / (1024 * 1024)).toFixed(2)} MB
                              </motion.p>
                            </div>

                            <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                layout
                                className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800"
                              >
                                {userImage.type}
                              </motion.p>

                              <div className="flex gap-2 mt-2 md:mt-0">
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
                          </motion.div>
                        )}
                        {!userImage && (
                          <motion.div
                            layoutId="file-upload"
                            variants={mainVariant}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                            className={cn(
                              "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                              "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                            )}
                          >
                            {isDragActive ? (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-neutral-600 flex flex-col items-center"
                              >
                                Drop it
                                <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                              </motion.p>
                            ) : (
                              <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                            )}
                          </motion.div>
                        )}

                        {!userImage && (
                          <motion.div
                            variants={secondaryVariant}
                            className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                          >
                            <img
                              src={imageUrl}
                              alt="Clothing item"
                              className="w-full h-full object-cover opacity-70"
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Preview section - show both images when user has uploaded */}
                {userImagePreview && (
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-medium text-gray-700 mb-4">
                      Preview:
                    </p>
                    <div className="flex items-center gap-4">
                      {/* User's image */}
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-gray-500 mb-2">Your photo</p>
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={userImagePreview}
                            alt="Your photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 flex items-center justify-center">
                          <motion.svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-gray-400"
                            animate={{ x: [0, 3, 0] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <path
                              d="M5 12H19M19 12L12 5M19 12L12 19"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </motion.svg>
                        </div>
                      </div>

                      {/* Clothing item */}
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-gray-500 mb-2">Trying on</p>
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={imageUrl}
                            alt="Clothing item"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
                }

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
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-ppMondwest hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={!userImage}
                  className="px-4 py-2 bg-black text-white font-ppMondwest hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
