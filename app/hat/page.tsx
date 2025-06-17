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
import Image from "next/image";
import { X } from "lucide-react";
import { Check } from "@phosphor-icons/react";
import CircularPicker from "@/components/products/jeans/animation";
interface PlacedSticker {
  id: string;
  uniqueKey: string;
  label: string;
  image: string;
}

export default function HatViewerPage() {
  const [macbookImage, setMacbookImage] = useState<string>(
    "/hat/Hat-3.png"
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
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);

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
    setPlacedStickers([]); // Clear all stickers
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
    setPlacedStickers([]); // Clear all stickers
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
    <div className="relative flex flex-col-reverse md:flex-col items-center min-h-screen bg-muted/40 p-4 md:p-8 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className={`space-y-8 transition-opacity duration-300 ${
            isEditMode || isCameraAnimating
              ? "opacity-5 pointer-events-none"
              : "opacity-100"
          }`}
        >
          <Card>
            <CardHeader>
              <CardTitle>MacBook Sticker Designer</CardTitle>
              <CardDescription>
                Upload a MacBook image or use the default.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isCameraAnimating}
              />
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={handleLoadDefault}
                disabled={isCameraAnimating}
              >
                Load Default MacBook & Reset
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>1. Click "Edit" to enter sticker placement mode</p>
                <p>2. Select up to 6 stickers from the bottom picker</p>
                <p>3. Stickers will appear randomly around your MacBook</p>
                <p>4. Hover over stickers to remove them</p>
                <p>
                  5. Click "Done" when you're finished or "Clear" to remove all
                  stickers
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Stickers placed: {placedStickers.length}/6</p>
              </div>
              <div className="mt-6 w-full max-w-xl flex justify-start gap-4 z-50">
                  <Button
                    onClick={handleEditButtonClick}
                    className="px-8 py-3 text-lg"
                    disabled={isCameraAnimating}
                  >
                    Choose Sticker
                  </Button>
              </div>
            </CardContent>
          </Card>
        </div>

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
              className={`relative w-full h-full flex items-center justify-center overflow-hidden border ${
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
                    <div className="relative size-12">
                      <Image
                        src={sticker.image}
                        alt={sticker.label}
                        fill
                        className="object-contain rounded-lg drop-shadow-lg"
                        sizes="(max-width: 640px) 64px, 80px"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* <AnimatePresence>
              {isEditMode && !isCameraAnimating && (
                <motion.div
                  className="absolute inset-0 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <HatCircularPicker
                    className="bg-transparent"
                    onStickerSelect={handleStickerSelect}
                    onStickerRemove={handleStickerRemoveFromPicker}
                    placedStickers={placedStickers}
                    selectedStickers={placedStickers.map((s) => s.id)}
                    maxStickers={3}
                  />
                </motion.div>
              )}
            </AnimatePresence> */}
            <AnimatePresence>
              {isEditMode && !isCameraAnimating && (
                <motion.div
                  className="absolute inset-0 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CircularPicker className="bg-transparent" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="mt-6 w-full max-w-xl flex justify-center gap-4 z-50">
            {isEditMode && (
              <>
                <Button
                  onClick={handleDoneEditClick}
                  className="px-8 py-3 text-lg"
                  disabled={isCameraAnimating}
                  size={"sm"}
                  variant={"outline"}
                >
                    <Check/>
                  Done
                </Button>
                {/* <Button
                  onClick={handleClearStickers}
                  variant="destructive"
                  className="px-6 py-3 text-lg"
                  disabled={isCameraAnimating || placedStickers.length === 0}
                  size={"sm"}
                >
                  Clear
                </Button> */}
              </>
            )}
          </div>

          <footer
            className={`mt-8 text-center text-sm text-muted-foreground transition-opacity duration-300 ${
              isEditMode || isCameraAnimating
                ? "opacity-30 pointer-events-none"
                : "opacity-100"
            }`}
          >
            <p>Device is not include with the sticker.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
