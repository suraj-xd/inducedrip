"use client";

import { useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

const initialItemsData = [
  {
    id: "item-6",
    label: "ChatGPT Image 1",
    image: "/patches/chatgpt/ChatGPT Image Jun 19, 2025, 01_16_08 PM.png",
    color: "bg-gradient-to-br from-teal-500 to-teal-700",
  },
  {
    id: "item-7",
    label: "ChatGPT Image 2",
    image: "/patches/chatgpt/ChatGPT Image Jun 19, 2025, 01_16_13 PM.png",
    color: "bg-gradient-to-br from-indigo-500 to-indigo-800",
  },
  {
    id: "item-8",
    label: "ChatGPT Image 3",
    image: "/patches/chatgpt/ChatGPT Image Jun 19, 2025, 01_28_09.png",
    color: "bg-gradient-to-br from-yellow-500 to-amber-700",
  },
  {
    id: "item-9",
    label: "ChatGPT Image 4",
    image: "/patches/chatgpt/ChatGPT Image Jun 19, 2025, 01_23_20 PM Background Removed.png",
    color: "bg-gradient-to-br from-purple-500 to-purple-800",
  },
];

interface CircularPickerProps {
  className?: string;
}

export default function CircularPickerHat({ className }: CircularPickerProps) {
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    label: string;
    color: string;
    image: string;
  } | null>(null);

  const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 35,
  };

  return (
    <LayoutGroup>
      <div
        className={`relative flex flex-col items-center justify-between w-full h-full p-4 sm:p-6 overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-center w-full h-3/5 pt-[14rem] min-h-[180px] sm:min-h-[240px]">
          <AnimatePresence>
            {selectedItem && (
              <motion.div
                layoutId={selectedItem.id}
                className="relative flex items-center justify-center cursor-pointer"
                onClick={() => setSelectedItem(null)}
                transition={springTransition}
                style={{ originX: 0.5, originY: 0.5 }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.7,
                  transition: {
                    duration: 0.2,
                
                    ...springTransition,
                    stiffness: 300,
                    damping: 30,
                  },
                }}
              >
                {/* Magical glowing background blob */}
                <motion.div
                  className="absolute inset-0 size-20 rounded-full blur-xl opacity-60"
                  style={{
                    background: `conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b)`,
                    filter: "blur(20px)",
                  }}
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                />

                {/* Sparkling particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute size-1 bg-white rounded-full"
                    style={{
                      top: `${40 + Math.cos(i * 60) * 60}%`,
                      left: `${50 + Math.sin(i * 60) * 60}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Main patch container */}
                <motion.div
                  className="relative size-12 rounded-2xl overflow-hidden bg-transparent"
                 
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 30px, 30px"
                  />
                  <div className="absolute inset-0" />
                </motion.div>

                {/* Close button */}
                {/* <motion.div
                  className="absolute -top-2 -right-2 bg-black/70 rounded-full p-2 hover:bg-black/90 transition-colors backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, transition: { delay: 0.15, ...springTransition } }}
                  exit={{ opacity: 0, scale: 0, transition: { duration: 0.1 } }}
                >
                  <X className="size-3 text-white" />
                </motion.div> */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center space-x-2 sm:space-x-3 w-full h-2/5 pt-4 sm:pt-10">
          {initialItemsData.map((item) => (
            <motion.div
              key={item.id}
              layoutId={item.id}
              onClick={() => {
                if (selectedItem) {
                  setSelectedItem(null);
                } else {
                  setSelectedItem(item);
                }
              }}
              className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-lg cursor-pointer ring-2 ring-white/20
                          ${
                            selectedItem && selectedItem.id !== item.id
                              ? "opacity-40 cursor-not-allowed"
                              : "cursor-pointer"
                          }
                          ${
                            selectedItem && selectedItem.id === item.id
                              ? "opacity-0 pointer-events-none"
                              : ""
                          }
                          ${
                            selectedItem && selectedItem.id === item.id
                              ? "!size-0"
                              : ""
                          }
                          `}
              whileHover={
                selectedItem &&
                (selectedItem.id === item.id ||
                  (selectedItem.id !== item.id && selectedItem))
                  ? {}
                  : {
                      scale: 1.1,
                      boxShadow: "0px 10px 25px rgba(0,0,0,0.3)",
                      rotateY: 5,
                    }
              }
              transition={springTransition}
              style={{ originX: 0.5, originY: 0.5 }}
            >
              <Image
                src={item.image}
                alt={item.label}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 40px, 40px"
              />
              {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" /> */}

              {/* Hover label */}
              <motion.div
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm opacity-0 pointer-events-none"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </LayoutGroup>
  );
}
