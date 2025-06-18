"use client";

import { useState } from "react";
import { useAiTryonStore, AiGeneration } from "@/lib/stores/ai-tryon-store";
import { X, Eye, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { AiTryonResultDialog } from "./ai-tryon-result-dialog";

export function AiTryonNotifications() {
  const { generations, removeGeneration, cancelGeneration } = useAiTryonStore();
  const [selectedResult, setSelectedResult] = useState<AiGeneration | null>(null);

  const handleView = (generation: AiGeneration) => {
    setSelectedResult(generation);
  };

  const handleCancel = (generation: AiGeneration) => {
    if (generation.status === 'generating') {
      cancelGeneration(generation.id);
    } else {
      removeGeneration(generation.id);
    }
  };

  const getStatusIcon = (status: AiGeneration['status']) => {
    switch (status) {
      case 'generating':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: AiGeneration['status']) => {
    switch (status) {
      case 'generating':
        return 'Generating...';
      case 'completed':
        return 'Ready to view';
      case 'failed':
        return 'Failed';
    }
  };

  if (generations.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
        {generations.map((generation) => (
          <div
            key={generation.id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[300px] animate-in slide-in-from-right-full"
          >
            <div className="flex items-start gap-3">
              {/* Clothing Image Thumbnail */}
              <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                <img
                  src={generation.clothingImageUrl}
                  alt="Clothing item"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(generation.status)}
                  <span className="text-sm font-medium text-gray-900">
                    AI Try-On
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">
                  {getStatusText(generation.status)}
                </p>

                {generation.status === 'failed' && generation.error && (
                  <p className="text-xs text-red-600 mb-2">
                    {generation.error}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {generation.status === 'completed' && (
                    <button
                      onClick={() => handleView(generation)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleCancel(generation)}
                    className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    {generation.status === 'generating' ? 'Cancel' : 'Dismiss'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Result Dialog */}
      {selectedResult && (
        <AiTryonResultDialog
          generation={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </>
  );
} 