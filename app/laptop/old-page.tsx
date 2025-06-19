"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import CircularPicker, { initialItemsData } from "@/components/circular-picker";
import Image from "next/image";
import { X } from "lucide-react";
import { Check } from "@phosphor-icons/react";
import ThreeDButton from "./3d-button";

interface PlacedSticker {
  id: string;
  uniqueKey: string;
  label: string;
  image: string;
}

// Create initial stickers from the first 3 items
const createInitialStickers = (): PlacedSticker[] => {
  return initialItemsData.slice(0, 3).map((item, index) => ({
    id: item.id,
    uniqueKey: `${item.id}-initial-${index}`,
    label: item.label,
    image: item.image,
  }));
};

export default function TryOnMacbook({
  setShowIn3D,
}: {
  setShowIn3D: (show: boolean) => void;
}) {
  const [macbookImage, setMacbookImage] = useState<string>(
    "/macbook/macbook-back.jpg"
  ); // Default MacBook image
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isCameraAnimating, setIsCameraAnimating] = useState<boolean>(false);
  const [imageScale, setImageScale] = useState<number>(1);
  const [imagePosition, setImagePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [imageRotation, setImageRotation] = useState<number>(0);
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>(
    createInitialStickers()
  );

  // Predefined positions to avoid overlap, inspired by the user's image reference
  const threeWayStickerPositions = [
    {
      x: -140,
      y: -100,
      rotation: Math.random() * 30 - 15,
      top: "40%",
      left: "29%",
    }, // Upper left
    {
      x: 120,
      y: -80,
      rotation: Math.random() * 30 - 15,
      top: "37%",
      left: "40%",
    }, // Upper right
    {
      x: -60,
      y: 120,
      rotation: Math.random() * 30 - 15,
      top: "43%",
      left: "36%",
    }, // Lower left
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const objectURL = URL.createObjectURL(file);
        setMacbookImage(objectURL);
        setError(null);
        setIsEditMode(false);
        // Add automatic rotation when new image is loaded
        setImageRotation(Math.random() * 10 - 5); // Random rotation between -5 and 5 degrees
        if (
          macbookImage &&
          macbookImage !== "/macbook/macbook-back.jpg" &&
          macbookImage.startsWith("blob:")
        ) {
          URL.revokeObjectURL(macbookImage);
        }
      } else {
        setError("Invalid file type. Please upload an image file.");
      }
    }
  };

  const handleLoadDefault = () => {
    if (isCameraAnimating) return;
    if (
      macbookImage &&
      macbookImage !== "/macbook/macbook-back.jpg" &&
      macbookImage.startsWith("blob:")
    ) {
      URL.revokeObjectURL(macbookImage);
    }
    setMacbookImage("/macbook/macbook-back.jpg");
    setError(null);
    setIsEditMode(false);
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
    setImageRotation(Math.random() * 10 - 5); // Add slight rotation even for default
    setPlacedStickers(createInitialStickers()); // Clear all stickers and recreate initial
    const input = document.getElementById("image-upload") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleEditButtonClick = () => {
    if (isCameraAnimating) return;
    setIsCameraAnimating(true);

    // Zoom in to show detail
    // setImageScale(1.3);
    // setImagePosition({ x: 0, y: 0 });

    setTimeout(() => {
      setIsEditMode(true);
      setIsCameraAnimating(false);
    }, 600);
  };

  const handleCancelEditClick = () => {
    if (isCameraAnimating) return;
    setIsCameraAnimating(true);
    setIsEditMode(false);

    // Reset to original position and scale
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });

    setTimeout(() => {
      setIsCameraAnimating(false);
    }, 600);
  };

  const handleDoneEditClick = () => {
    if (isCameraAnimating) return;
    setIsCameraAnimating(true);
    setIsEditMode(false);

    // Reset to original position and scale
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });

    setTimeout(() => {
      setIsCameraAnimating(false);
    }, 600);
  };

  const handleClearStickers = () => {
    if (isCameraAnimating) return;
    setPlacedStickers(createInitialStickers()); // Clear all stickers and recreate initial
  };

  const handleStickerSelect = (sticker: {
    id: string;
    label: string;
    image: string;
  }) => {
    if (placedStickers.length >= 6) return; // Max 6 stickers for better distribution

    const newSticker: PlacedSticker = {
      ...sticker,
      uniqueKey: `${sticker.id}-${Date.now()}`,
    };

    setPlacedStickers((prev) => [...prev, newSticker]);
  };

  const handleStickerRemove = (uniqueKey: string) => {
    setPlacedStickers((prev) =>
      prev.filter((sticker) => sticker.uniqueKey !== uniqueKey)
    );
  };

  const handleStickerRemoveFromPicker = (stickerId: string) => {
    // Remove all instances of this sticker type from placed stickers
    setPlacedStickers((prev) =>
      prev.filter((sticker) => sticker.id !== stickerId)
    );
  };

  useEffect(() => {
    return () => {
      if (
        macbookImage &&
        macbookImage !== "/macbook/macbook-back.jpg" &&
        macbookImage.startsWith("blob:")
      ) {
        URL.revokeObjectURL(macbookImage);
      }
    };
  }, [macbookImage]);

  return (
    <div className={`flex flex-col items-center lg:sticky lg:top-8 h-max`}>
      <motion.div
        className="relative w-full max-w-2xl rounded-lg overflow-visible"
        style={{ aspectRatio: "4 / 5" }}
        animate={{
          zIndex: isEditMode ? 20 : 10,
        }}
        transition={{ duration: 0.1 }}
      >
        <motion.div
          className={`relative w-full h-full flex items-center justify-center overflow-hidden ${
            isEditMode && false ? " rounded-b-[20px] shadow-2xl" : ""
          }`}
          animate={{
            scale: imageScale,
            x: imagePosition.x,
            y: imagePosition.y,
            rotate: imageRotation,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <Image
            src={macbookImage}
            alt="MacBook"
            fill
            className="object-cover"
            sizes="(max-width: 608px) 100vw, 40vw"
          />

          {/* Placed Stickers */}
          <AnimatePresence>
            {placedStickers.map((sticker, index) => (
              <motion.div
                key={sticker.uniqueKey}
                className="absolute group"
                style={{
                  left: threeWayStickerPositions[index].left,
                  top: threeWayStickerPositions[index].top,
                  // transform: `translate(calc(-50% + ${sticker.x}px), calc(-50% + ${sticker.y}px)) rotate(${sticker.rotation}deg)`,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.5,
                  rotate: threeWayStickerPositions[index].rotation - 45,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: threeWayStickerPositions[index].rotation,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                  rotate: threeWayStickerPositions[index].rotation + 45,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="relative size-16">
                  <Image
                    src={sticker.image}
                    alt={sticker.label}
                    fill
                    className="object-contain rounded-lg drop-shadow-lg"
                    sizes="(max-width: 640px) 120px, 120px"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          <motion.div
            className="absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CircularPicker
              className="bg-transparent"
              onStickerSelect={handleStickerSelect}
              onStickerRemove={handleStickerRemoveFromPicker}
              placedStickers={placedStickers}
              selectedStickers={placedStickers.map((s) => s.id)}
              maxStickers={3}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="absolute top-0 -right-5 flex w-fit h-[65%] justify-center items-center gap-4 z-10">
        <ThreeDButton
          className="relative bottom-10 mb-5 pb-5 "
          onClick={() => setShowIn3D(false)}
        >
          {"Done"}
        </ThreeDButton>
      </div>
    </div>
  );
}
