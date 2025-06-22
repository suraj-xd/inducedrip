"use client";

import { AnimatePresence } from "framer-motion";
import PaymentButton from "@/components/command-drip/payment-button";
import ProductInfo from "@/components/command-drip/product-info";
import ProductDetailsAccordion from "@/components/command-drip/product-details-accordion";
import ProductImageSwiper from "@/components/command-drip/product-image-swiper";
import Toggle3DButton from "@/components/command-drip/toggle-3d-button";
import MotionFadeVarientWrapper from "@/components/command-drip/motion-fade-varient-wrapper";
import { Suspense, useState } from "react";
import { clothes } from "@/components/layout/main-page/data";
import BackButton from "@/components/command-drip/back-button";
import { lazy } from "react";
import SpinnerLoadingCenter from "@/components/command-drip/spinner-loading-center";

const ThreeDDiaryViewer = lazy(() => import("./3d-diary-viewer"));
const YouMayAlsoLike = lazy(
  () => import("@/components/comman/you-may-also-like")
);

export default function CustomDiaryPage() {
  const [showIn3D, setShowIn3D] = useState(false);

  const data = clothes[2];

  return (
    <section className="w-[90%] md:w-[95%] flex flex-col gap-4 mt-12 md:mt-16 mx-auto">
      <div className="w-full flex justify-end relative flex-col md:flex-row z-[1]">
        {/* Left Side */}
        <div className="w-full m-auto flex flex-col justify-center items-center gap-y-4 z-[2] ">
          <div
            style={{ aspectRatio: "5/6.3" }}
            className=" w-full md:w-[500px] relative md:mr-[100px] max-h-[600px]"
          >
            <AnimatePresence mode="wait">
              {showIn3D ? (
                <MotionFadeVarientWrapper>
                  <Suspense fallback={<SpinnerLoadingCenter />}>
                    <ThreeDDiaryViewer />
                  </Suspense>
                </MotionFadeVarientWrapper>
              ) : (
                <MotionFadeVarientWrapper>
                  <ProductImageSwiper images={data?.images} />
                </MotionFadeVarientWrapper>
              )}
            </AnimatePresence>
            <div className="relative z-[100] -top-4 bullet-buttons flex  justify-center items-center gap-4 "></div>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="relative z-[2]">
          <div className="max-w-[450px] sticky top-[90px] md:-translate-x-16 pt-[20px] md:pt-[15vh]">
            <BackButton />
            {/* Product Name and Price */}
            <ProductInfo name={data?.product_name} price={data?.price} />
            <div className="mt-4 flex flex-col gap-y-2 ">
              <Toggle3DButton showIn3D={showIn3D} setShowIn3D={setShowIn3D} />
            </div>

            <p className="mt-4 text-xs">{data?.description}</p>
            <div className="flex gap-4 my-5">
              <PaymentButton />
            </div>
            {/* Details */}
            <ProductDetailsAccordion details={data?.details || []} />
          </div>
        </div>
      </div>

      <Suspense fallback={<SpinnerLoadingCenter />}>
        <YouMayAlsoLike currentProductId={data?.id} />
      </Suspense>
    </section>
  );
}
