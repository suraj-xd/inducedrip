"use client";

import { AiGeneration } from "@/lib/stores/ai-tryon-store";
import { X, Download, Share, Star } from "lucide-react";
import Image from "next/image";

interface AiTryonResultDialogProps {
  generation: AiGeneration;
  onClose: () => void;
}

export function AiTryonResultDialog({ generation, onClose }: AiTryonResultDialogProps) {
  const handleDownload = () => {
    if (generation.resultImageUrl) {
      const link = document.createElement('a');
      link.href = generation.resultImageUrl;
      link.download = `ai-tryon-${generation.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (generation.resultImageUrl && navigator.share) {
      try {
        const response = await fetch(generation.resultImageUrl);
        const blob = await response.blob();
        const file = new File([blob], `ai-tryon-${generation.id}.jpg`, { type: 'image/jpeg' });
        
        await navigator.share({
          title: 'My AI Try-On Result',
          text: 'Check out how this looks on me!',
          files: [file],
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to copying URL
        navigator.clipboard.writeText(generation.resultImageUrl);
      }
    } else if (generation.resultImageUrl) {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(generation.resultImageUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-[90%] max-w-2xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">AI Try-On Result</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="space-y-6">
            {/* Result Image */}
            <div className="flex justify-center">
              <div className="relative max-w-md rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                {generation.resultImageUrl && (
                  <img
                    src={generation.resultImageUrl}
                    alt="AI try-on result"
                    className="w-full h-auto"
                  />
                )}
              </div>
            </div>

            {/* Original Images Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-2">Your Photo</p>
                <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={generation.userImageUrl}
                    alt="Your photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-2">Clothing Item</p>
                <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={generation.clothingImageUrl}
                    alt="Clothing item"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {generation.description && (
              <div className="text-center text-sm text-gray-600 max-w-md mx-auto">
                <p>{generation.description}</p>
              </div>
            )}
            
            {generation.confidence && (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Star className="w-4 h-4" />
                <span>Quality Score: {Math.round(generation.confidence * 100)}%</span>
              </div>
            )}

            <div className="text-center text-sm text-gray-500">
              Generated on {generation.createdAt.toLocaleDateString()} at{' '}
              {generation.createdAt.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleShare}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Share className="h-4 w-4" />
              Share
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}  