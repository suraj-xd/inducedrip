"use client";

import { useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

const initialItemsData = [
  {
    id: "item-1",
    label: "Gameboy",
    image: "/patches/png/Gameboy Background Removed.png",
    color: "bg-gradient-to-br from-gray-700 to-gray-900",
    position: { x: -80, y: -100 }, // Top left position
  },
  {
    id: "item-2",
    label: "Space Shuttle",
    image: "/patches/png/NASASpaceShuttle Background Removed.png",
    color: "bg-gradient-to-br from-blue-600 to-blue-900",
    position: { x: 80, y: -100 }, // Top right position
  },
  {
    id: "item-3",
    label: "Tongue",
    image: "/patches/png/TongueWithAcid_1_PC-12881 Background Removed.png",
    color: "bg-gradient-to-br from-green-500 to-green-800",
    position: { x: 0, y: -40 }, // Middle position
  },
  {
    id: "item-4",
    label: "Bro Code",
    image:
      "/patches/png/The-Bro-Code-Patch-Rule-Book-Comedy-Embroidered-Iron-On-Patch-Collection-4116088 Background Removed.png",
    color: "bg-gradient-to-br from-orange-500 to-red-600",
    position: { x: -70, y: 20 }, // Bottom left position
  },
  {
    id: "item-5",
    label: "So Fetch",
    image:
      "/patches/png/That_s-So-Fetch-With-Lips-Box-Embroidered-Iron-On-Patch-Patch-Collection-3458850 Background Removed.png",
    color: "bg-gradient-to-br from-pink-500 to-purple-600",
    position: { x: 70, y: 20 }, // Bottom right position
  },
];

interface CircularPickerProps {
  className?: string;
  onStickerSelect?: (sticker: {
    id: string;
    label: string;
    image: string;
  }) => void;
  onStickerRemove?: (stickerId: string) => void;
  selectedStickers?: string[];
  maxStickers?: number;
  placedStickers?: {
    id: string;
    label: string;
    image: string;
  }[];
}

export default function HatCircularPicker({
  className,
  onStickerSelect,
  onStickerRemove,
  selectedStickers = [],
  maxStickers = 3,
  placedStickers = [],
}: CircularPickerProps) {
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    label: string;
    color: string;
    image: string;
    position: { x: number; y: number };
  } | null>(null);

  const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 35,
  };

  const handleItemClick = (item: (typeof initialItemsData)[0]) => {
    if (placedStickers.length >= maxStickers) return;
    // If we have the new multi-sticker functionality
    if (onStickerSelect) {
      // Check if sticker is already selected or if we've reached max
      if (
        !selectedStickers.includes(item.id) &&
        selectedStickers.length < maxStickers
      ) {
        onStickerSelect({
          id: item.id,
          label: item.label,
          image: item.image,
        });
      }
    } else {
      // Original single-sticker behavior
      if (selectedItem) {
        setSelectedItem(null);
      } else {
        setSelectedItem(item);
      }
    }
  };

  const handleRemoveClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    if (onStickerRemove) {
      onStickerRemove(itemId);
    }
  };

  // For multi-sticker mode, don't show the large selected item
  const showSelectedItem = !onStickerSelect && selectedItem;

  return (
    <LayoutGroup>
      <div
        className={`relative flex flex-col items-center justify-between w-full h-full p-4 sm:p-6 overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-center w-full h-3/5 pt-36 min-h-[180px] sm:min-h-[240px] relative">
          <AnimatePresence>
            {showSelectedItem && (
              <motion.div
                layoutId={selectedItem.id}
                className={`absolute flex items-center justify-center cursor-pointer ${selectedItem.id}`}
                onClick={() => setSelectedItem(null)}
                transition={springTransition}
                style={{
                  originX: 0.5,
                  originY: 0.5,
                  x: selectedItem.position.x,
                  y: selectedItem.position.y,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.7,
                  rotate: -15,
                  x: selectedItem.position.x,
                  y: selectedItem.position.y - 50, // Start higher for falling effect
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  x: selectedItem.position.x,
                  y: selectedItem.position.y,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.7,
                  rotate: 15,
                  transition: {
                    duration: 0.2,
                    ...springTransition,
                    stiffness: 300,
                    damping: 30,
                  },
                }}
              >
                {/* Main patch container - clean without effects */}
                <motion.div
                  className="relative size-20 rounded-2xl overflow-hidden bg-transparent shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 128px"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center space-x-2 sm:space-x-3 w-full h-2/5 pt-4 sm:pt-6">
          {initialItemsData.map((item) => {
            const isSelected = onStickerSelect
              ? selectedStickers.includes(item.id)
              : selectedItem?.id === item.id;
            const isDisabled = onStickerSelect
              ? selectedStickers.length >= maxStickers && !isSelected
              : false;

            return (
              <motion.div
                key={item.id}
                layoutId={onStickerSelect ? `multi-${item.id}` : item.id}
                onClick={() => handleItemClick(item)}
                className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl shadow-lg cursor-pointer ring-2 ring-white/20
                            ${
                              isDisabled
                                ? "opacity-40 cursor-not-allowed"
                                : "cursor-pointer"
                            }
                            ${
                              isSelected && !onStickerSelect
                                ? "opacity-0 pointer-events-none"
                                : ""
                            }
                            ${isSelected && !onStickerSelect ? "!size-0" : ""}
                            ${
                              isSelected && onStickerSelect
                                ? "ring-4 ring-green-400 ring-opacity-80"
                                : ""
                            }
                            `}
                whileHover={
                  isDisabled || (isSelected && !onStickerSelect)
                    ? {}
                    : {
                        scale: 1.1,
                        boxShadow: "0px 10px 25px rgba(0,0,0,0.3)",
                        rotateY: 5,
                      }
                }
                transition={springTransition}
                style={{
                  originX: 0.5 + Math.random() * 0.1 - 0.05,
                  originY: 0.5 + Math.random() * 0.1 - 0.05,
                }}
              >
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 56px, 64px"
                />

                {/* Selection indicator for multi-sticker mode */}
                {onStickerSelect && isSelected && (
                  <motion.div
                    onClick={(e) => handleRemoveClick(e, item.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-red-600 transition-colors"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <X className="w-2.5 h-2.5 text-white drop-shadow-lg" />
                  </motion.div>
                )}

                {/* Hover label */}
                <motion.div
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm opacity-0 pointer-events-none"
                  whileHover={!isDisabled ? { opacity: 1 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </LayoutGroup>
  );
}
