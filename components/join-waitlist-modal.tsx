"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { GiftIcon, SpinnerIcon, Upload } from "@phosphor-icons/react";
import { toast } from "sonner";

interface JoinWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function JoinWaitlistModal({
  isOpen,
  onClose,
  productName = "Product",
}: JoinWaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAlreadyJoined, setIsAlreadyJoined] = useState(false);

  const waitlistKey = `waitlist-joined-${productName}`;

  useEffect(() => {
    // Check local storage when the modal opens or product changes
    if (isOpen) {
      const alreadyJoined = localStorage.getItem(waitlistKey) === "true";
      if (alreadyJoined) {
        setIsAlreadyJoined(true);
      }
    }
  }, [isOpen, waitlistKey]);

  const handleAddJoinWaitlist = async () => {
    if (!email.trim() || isAlreadyJoined) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          message: `User joined the waitlist for ${productName}`,
          type: "waitlist",
          productName: productName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle case where user is already on the waitlist (from server)
        if (response.status === 409) {
          setIsAlreadyJoined(true);
          localStorage.setItem(waitlistKey, "true");
        }
        throw new Error(data.error || "Failed to join waitlist");
      }

      // Set flag in local storage on successful signup
      localStorage.setItem(waitlistKey, "true");
      setIsAlreadyJoined(true);

      // Reset form and close modal
      setEmail("");
      onClose();

      // Show success toast
      toast.success("You're on the waitlist!", {
        description: `We'll notify you when ${productName} is available. Check your email for confirmation!`,
      });
    } catch (error) {
      console.error("Failed to join waitlist:", error);
      // Show error toast
      toast.error("Oops! Something went wrong", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to join waitlist. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 font-sans">
        <DialogHeader className="pt-3 border-b border-gray-200 pb-2">
          <DialogTitle className="text-center font-ppMondwest">Join Waitlist</DialogTitle>
          <DialogDescription className="text-center">
            {isAlreadyJoined
              ? "You're already on the waitlist!"
              : `Be the first to know when ${productName} is available.`}
          </DialogDescription>
          <p className="text-center text-xs flex items-center gap-1 text-green-600 bg-green-50 font-medium border w-fit mx-auto px-2 py-1 rounded-md"><GiftIcon weight="fill" size={12} /> We'll send you free digital stickers</p>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4 pt-0">
          <div className="flex flex-col gap-2 px-4">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isAlreadyJoined || isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddJoinWaitlist();
                }
              }}
              className="w-full"
            />
          </div>

          {/* Footer */}
          <div className="border-t p-4 pb-0">
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
                onClick={handleAddJoinWaitlist}
                disabled={!email || isLoading || isAlreadyJoined}
                className="px-4 py-2 bg-black text-white font-ppMondwest hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                whileHover={{ scale: !email || isLoading ? 1 : 1.05 }}
                whileTap={{ scale: !email || isLoading ? 1 : 0.95 }}
              >
                {isLoading ? (
                  <>
                    <SpinnerIcon size={16} className="animate-spin" />
                    Joining...
                  </>
                ) : isAlreadyJoined ? (
                  "You're on the list!"
                ) : (
                  "Submit"
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
