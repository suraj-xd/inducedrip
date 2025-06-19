"use client";

import { useState } from "react";
import { ShoppingBag, Info } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PaymentButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const openPaymentWindow = () => {
    const paymentUrl =
      "https://pay.nmkr.io/?p=c6392d1f60474xyz5a5ff48d56d3e&c=1&pm=wallet";

    // Specify the popup width and height
    const popupWidth = 500;
    const popupHeight = 700;

    // Calculate the center of the screen with null checks
    const windowTop = window.top || window;
    const left =
      windowTop.outerWidth / 2 + (windowTop.screenX || 0) - popupWidth / 2;
    const top =
      windowTop.outerHeight / 2 + (windowTop.screenY || 0) - popupHeight / 2;

    const popup = window.open(
      paymentUrl,
      "NFT-MAKER PRO Payment Gateway",
      `popup=1, location=1, width=${popupWidth}, height=${popupHeight}, left=${left}, top=${top}`
    );

    // Show dim background
    if (document.body.style) {
      document.body.style.background = "rgba(0, 0, 0, 0.5)";
    }

    // Continuously check whether the popup has been closed
    const backgroundCheck = setInterval(function () {
      if (popup?.closed) {
        clearInterval(backgroundCheck);
        console.log("Popup closed");
        // Remove dim background
        if (document.body.style) {
          document.body.style.background = "";
        }
      }
    }, 1000);
  };

  return (
    <div className="relative flex flex-col gap-y-2">
      <Tooltip>
        <TooltipTrigger>
          <img
            className="cursor-pointer hover:opacity-80"
            src="https://pro.nft-maker.io/images/buttons/paybutton_1_1.svg"
            onClick={openPaymentWindow}
          />
        </TooltipTrigger>
        <TooltipContent>Crypto payments are on hold</TooltipContent>
      </Tooltip>
      <button
        onClick={openPaymentWindow}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-full flex justify-center py-5 rounded-[30px] items-center gap-2 bg-black text-white p-4 text-xs uppercase font-semibold tracking-[1.1px] hover:bg-gray-800 transition-colors duration-200"
      >
        <ShoppingBag size={16} />
        Buy Now
      </button>

      {/* Tooltip */}
    </div>
  );
}
