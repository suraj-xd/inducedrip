"use client";

import { useState } from "react";
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
import { GiftIcon, Upload } from "@phosphor-icons/react";

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

  const handleAddJoinWaitlist = async () => {
    if (!email.trim()) return;

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add your actual waitlist API call here
      console.log("Adding to waitlist:", { email, product: productName });

      // Reset form and close modal
      setEmail("");
      onClose();

      // You might want to show a success toast here
    } catch (error) {
      console.error("Failed to join waitlist:", error);
      // Handle error - maybe show error toast
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
            Be the first to know when{" "}
            <span className="font-semibold">{productName}</span> is available.
          </DialogDescription>
          <p className="text-center text-xs flex items-center gap-1 text-green-600 bg-green-50 font-medium border w-fit mx-auto px-2 py-1 rounded-md"><GiftIcon weight="fill" size={12} /> We'll send you free digital stickers and patches</p>
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
                disabled={!email}
                className="px-4 py-2 bg-black text-white font-ppMondwest hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                whileHover={{ scale: !email ? 1 : 1.05 }}
                whileTap={{ scale: !email ? 1 : 0.95 }}
              >
                Submit
              </motion.button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
