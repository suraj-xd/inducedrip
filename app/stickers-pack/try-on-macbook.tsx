"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CircularPicker, { initialItemsData } from "@/components/circular-picker";
import Image from "next/image";
import ThreeDButton from "@/components/command-drip/3d-button";

interface PlacedSticker {
  id: string;
  uniqueKey: string;
  label: string;
  image: string;
}

const createInitialStickers = (): PlacedSticker[] => {
  return initialItemsData.slice(0, 3).map((item, index) => ({
    id: item.id,
    uniqueKey: `${item.id}-initial-${index}`,
    label: item.label,
    image: item.image,
  }));
};

const macbookImage = "/macbook/macbook-back.jpg";

export default function TryOnMacbook({
  setShowIn3D,
}: {
  setShowIn3D: (show: boolean) => void;
}) {
  const isEditMode = true;
  const imageScale = 1;
  const imagePosition = {
    x: 0,
    y: 0,
  };
  const imageRotation = 0;
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

  const handleStickerRemoveFromPicker = (stickerId: string) => {
    setPlacedStickers((prev) =>
      prev.filter((sticker) => sticker.id !== stickerId)
    );
  };

  return (
    <div className={`flex flex-col items-center lg:sticky lg:top-8 h-max z-100 relative`}>
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
      <div className="absolute top-0 -right-5 flex w-fit h-[65%] justify-center items-center gap-4 z-[1000]">
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
