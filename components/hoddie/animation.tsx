"use client";

import { useState, useEffect, useRef } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { Code, Pen, ChartLine } from "@phosphor-icons/react";
import Image from "next/image";

const tagOptions = [
  { id: "eng", label: "ENG", color: "from-blue-500 to-blue-700", icon: <Code /> },
  { id: "design", label: "DESIGN", color: "from-purple-500 to-purple-700", icon: <Pen /> },
  { id: "research", label: "RESEARCH", color: "from-green-500 to-green-700", icon: <ChartLine /> },
];

interface CircularPickerProps {
  className?: string;
}

export default function HoddieCircularPicker({
  className,
}: CircularPickerProps) {
  const [selectedTag, setSelectedTag] = useState("eng");
  const [displayText, setDisplayText] = useState("ENG");

  const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 35,
  };

  // Update display text when tag changes
  useEffect(() => {
    const selectedTagData = tagOptions.find(tag => tag.id === selectedTag);
    if (selectedTagData) {
      setDisplayText(selectedTagData.label);
    }
  }, [selectedTag]);

  const handleTagSelect = (tagId: string) => {
    setSelectedTag(tagId);
  };

  return (
    <LayoutGroup>
      <div
        className={`relative flex flex-col items-center justify-between w-full h-full p-4 sm:p-6 overflow-hidden ${className}`}
      >
        {/* Text Display Area */}
        <div className="flex items-center justify-center flex-col w-full h-3/5 pt-36 min-h-[180px] sm:min-h-[240px]">
          <div className="flex w-full mb-2 items-center justify-center">
            <Image
              src="induced_logo.svg"
              alt="hoddie"
              className="opacity-20 invert"
              width={80}
              height={100}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key="text-display"
              className="relative flex flex-col items-center justify-center cursor-pointer"
              transition={springTransition}
              style={{ originX: 0.5, originY: 0.5 }}
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.7,
                y: -20,
                transition: {
                  duration: 0.3,
                  ...springTransition,
                  stiffness: 300,
                  damping: 30,
                },
              }}
            >
              {/* Text Display */}
              <motion.div className="relative text-center max-w-xs" layout>
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={displayText}
                    className="text-[10px] font-mono uppercase tracking-wide text-black/50 drop-shadow-lg"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  >
                    {"["}{displayText}{"]"}
                  </motion.h2>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tag Selection */}
        <div className="flex items-center justify-center w-full h-2/5 pt-4 sm:pt-6">
          <motion.div 
            className="gap-3 sm:gap-4 grid grid-cols-3"
            layout
          >
            {tagOptions.map((tag) => (
              <motion.button
                key={tag.id}
                onClick={() => handleTagSelect(tag.id)}
                className={`relative px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 backdrop-blur-md border-2 ${
                  selectedTag === tag.id
                    ? `bg-gradient-to-r ${tag.color} text-white border-white/40 shadow-lg`
                    : "bg-black/40 text-white/70 border-white/20 hover:border-white/40 hover:bg-black/60"
                }`}
                whileHover={
                  selectedTag !== tag.id
                    ? {
                        scale: 1.05,
                        boxShadow: "0px 5px 15px rgba(255,255,255,0.1)",
                      }
                    : {}
                }
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: selectedTag === tag.id ? 1.1 : 1,
                  boxShadow: selectedTag === tag.id 
                    ? "0px 10px 25px rgba(255,255,255,0.2)" 
                    : "0px 2px 8px rgba(0,0,0,0.3)",
                }}
                transition={springTransition}
              >
                {/* Active indicator */}
                {selectedTag === tag.id && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.2), transparent)`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                {/* Glow effect for active tag */}
                {selectedTag === tag.id && (
                  <motion.div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tag.color} opacity-50 blur-sm`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 0.3 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  />
                )}
                
                <span className="relative z-10 flex items-center gap-2 w-full justify-center">{tag.icon} {tag.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </LayoutGroup>
  );
}
