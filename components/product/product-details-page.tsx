"use client";

import { useState } from "react";
import AiTryOn from "@/components/command-drip/ai-try-on";
import PaymentButton from "@/components/command-drip/payment-button";
import YouMayAlsoLike from "@/components/comman/you-may-also-like";
import ThreeDButton from "../command-drip/3d-button";
import BackButton from "../command-drip/back-button";
import ProductInfo from "../command-drip/product-info";
import ProductDetailsAccordion from "../command-drip/product-details-accordion";
import ProductImageSwiper from "../command-drip/product-image-swiper";

interface Product {
  id: number;
  product_name: string;
  price: string;
  description: string;
  details: string[];
  images: string[];
}

interface ProductDetailsPageProps {
  product: Product;
  aiTryOn?: boolean;
}

export default function ProductDetailsPage({
  product,
  aiTryOn = false,
}: ProductDetailsPageProps) {
  const [showAiTryOn, setShowAiTryOn] = useState(false);
  if (!product) {
    return null;
  }

  return (
    <section className="w-[90%] md:w-[95%] flex flex-col gap-4 mt-12 md:mt-16 mx-auto">
      <div className="w-full flex justify-end relative flex-col md:flex-row z-[1]">
        <div className="w-full m-auto flex flex-col justify-center items-center gap-y-4 z-[2]">
          <div
            style={{ aspectRatio: "5/6.3" }}
            className="w-full md:w-[500px] relative md:mr-[100px] max-h-[600px]"
          >
            <div className="h-full p-5">
              <ProductImageSwiper images={product?.images} />
            </div>
            <div className="relative z-[100] -top-4 bullet-buttons flex justify-center items-center gap-4"></div>
          </div>
          {aiTryOn && (
            <div className="absolute bottom-0 left-0 flex w-full h-full justify-center items-center gap-4">
              <ThreeDButton onClick={() => setShowAiTryOn(true)}>
                AI Try On
              </ThreeDButton>
            </div>
          )}
        </div>

        <div className="relative z-[2]">
          <div className="max-w-[450px] sticky top-[90px] md:-translate-x-16 pt-[20px] md:pt-[15vh]">
            <BackButton />
            <ProductInfo name={product?.product_name} price={product?.price} />

            <p className="mt-4 text-xs">{product?.description}</p>
            <div className="flex gap-4 my-5">
              <PaymentButton />
            </div>
            <ProductDetailsAccordion details={product?.details} />
          </div>
        </div>
      </div>

      <YouMayAlsoLike currentProductId={product?.id} />
      <AiTryOn
        isOpen={showAiTryOn}
        onClose={() => setShowAiTryOn(false)}
        imageUrl={product?.images[0]}
      />
    </section>
  );
}
