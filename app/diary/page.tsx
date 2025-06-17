"use client";

import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
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

interface PlacedSticker {
  id: string;
  uniqueKey: string;
  label: string;
  image: string;
}

export default function DiaryViewerPage() {
  const [macbookImage, setMacbookImage] = useState<string>(
    "/diary/diary.png"
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
  
  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(true);
  const [lastPosition, setLastPosition] = useState<{x: number, y: number} | null>(null);


  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set up drawing style
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Start a new path
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    setLastPosition({ x, y });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawingMode || !lastPosition) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    // Continue the current path - this creates smooth connected lines
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    // Update last position
    setLastPosition({ x: currentX, y: currentY });
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Close the current path
          ctx.closePath();
        }
      }
    }
    setIsDrawing(false);
    setLastPosition(null);
  };

  const handleHoverDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create very light hover preview
    ctx.fillStyle = '#ffffff20';
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.fill();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
  };

  // Initialize canvas when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

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
    clearCanvas(); // Clear canvas drawings
    const input = document.getElementById("image-upload") as HTMLInputElement;
    if (input) input.value = "";
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
              <CardTitle>Book Scribble Designer</CardTitle>
              <CardDescription>
                Upload a book image or use the default.
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
                Load Default Book & Reset
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Drawing Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={toggleDrawingMode}
                  variant={isDrawingMode ? "default" : "outline"}
                  className="flex-1"
                >
                  {isDrawingMode ? "Drawing Mode ON" : "Enable Drawing"}
                </Button>
                <Button
                  onClick={clearCanvas}
                  variant="outline"
                  className="flex-1"
                >
                  Clear Drawings
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Enable drawing mode to start drawing lines</p>
                <p>• Click and drag to draw sharp lines</p>
                <p>• Release to end the current line</p>
                <p>• Use "Clear Drawings" to remove all lines</p>
              </div>
            </CardContent>
          </Card>

        </div>

        <div className={`flex flex-col items-center lg:sticky lg:top-8 h-max`}>
          <motion.div
            className="relative w-full max-w-2xl rounded-lg overflow-visible "
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
                alt="Book"
                fill
                className="object-cover"
                sizes="(max-width: 608px) 100vw, 40vw"
              />

              {/* Drawing Canvas Overlay */}
              <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full pointer-events-auto ${
                  isDrawingMode ? 'cursor-pen' : 'cursor-default'
                }`}
                style={{ 
                  zIndex: 15,
                  cursor: isDrawingMode 
                    ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' className="invert" stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 19l7-7 3 3-7 7-3-3z'/%3E%3Cpath d='M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z'/%3E%3Cpath d='M2 2l7.586 7.586'/%3E%3Ccircle cx='11' cy='11' r='2'/%3E%3C/svg%3E") 12 12, crosshair`
                    : 'default'
                }}
                onMouseDown={startDrawing}
                onMouseMove={isDrawing ? draw : handleHoverDraw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
