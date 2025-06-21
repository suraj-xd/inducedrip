"use client";

import { useState, Suspense, lazy } from "react";
import { clothes } from "@/components/layout/main-page/data";
import ThreeDButton from "@/components/command-drip/3d-button";
import AiTryOn from "@/components/command-drip/ai-try-on";
import { AnimatePresence } from "framer-motion";
import BackButton from "@/components/command-drip/back-button";
import ProductInfo from "@/components/command-drip/product-info";
import ProductDetailsAccordion from "@/components/command-drip/product-details-accordion";
import MotionFadeVarientWrapper from "@/components/command-drip/motion-fade-varient-wrapper";
import SpinnerLoadingCenter from "@/components/command-drip/spinner-loading-center";
import JoinWaitlistModal from "@/components/join-waitlist-modal";
import ProductImageSwiper from "@/components/command-drip/product-image-swiper";

const YouMayAlsoLike = lazy(
  () => import("@/components/comman/you-may-also-like")
);

export default function CustomGraymatterSuitPage() {
  const [showAiTryOn, setShowAiTryOn] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  const data = clothes[3];

  if (!data) {
    return <>Invalid</>;
  }

  return (
    <section className="w-[90%] md:w-[95%] flex flex-col gap-4 mt-12 md:mt-16 mx-auto pt-5">
      <div className="w-full flex justify-end relative flex-col md:flex-row z-[1]">
        <div className="w-full m-auto flex flex-col justify-center items-center gap-y-4 z-[2] ">
          <div
            style={{ aspectRatio: "5/6.3" }}
            className=" w-full md:w-[500px] relative md:mr-[100px] max-h-[600px]"
          >
            <AnimatePresence mode="wait">
              <MotionFadeVarientWrapper>
                <ProductImageSwiper images={data?.images} />
              </MotionFadeVarientWrapper>
            </AnimatePresence>
            <div className="relative z-[100] -top-4 bullet-buttons flex justify-center items-center gap-4"></div>
          </div>
          <div className="absolute bottom-0 left-0 flex w-full h-full justify-center items-center gap-4">
            <ThreeDButton onClick={() => setShowAiTryOn(true)}>
              AI Try On
            </ThreeDButton>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-[2]">
          <div className="max-w-[450px] sticky top-[90px] md:-translate-x-16 pt-[20px] md:pt-[15vh]">
            <BackButton />
            <ProductInfo name={data?.product_name} price={data?.price} />
            <div className="mt-4">
              <button
                onClick={() => setShowWaitlistModal(true)}
                className="w-full bg-black text-white p-4 text-xs uppercase font-semibold tracking-[1.1px] hover:bg-gray-800 transition-colors"
              >
                JOIN WAITLIST
              </button>
            </div>

            <p className="mt-4 text-xs">{data?.description}</p>
            <ProductDetailsAccordion details={data?.details || []} />
          </div>
        </div>
      </div>

      <Suspense fallback={<SpinnerLoadingCenter />}>
        <YouMayAlsoLike currentProductId={data?.id} />
      </Suspense>

      {/* AI Try On Dialog */}
      <AiTryOn
        isOpen={showAiTryOn}
        onClose={() => setShowAiTryOn(false)}
        imageUrl={data?.images[0] || ""}
      />

      {/* Join Waitlist Modal */}
      <JoinWaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
        productName={data?.product_name}
      />
    </section>
  );
}
