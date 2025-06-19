"use client";

import Image from "next/image";
// import {AiOutlinePlus} from 'react-icons/ai';
// import {HiArrowLeft, HiArrowRight} from 'react-icons/hi';
import { useMemo, useState } from "react";
import { clothes } from "@/components/layout/main-page/data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import CustomJeansViewer from "./custom-jeans-viewer";
import ThreeDButton from "./3d-button";
import AiTryOn from "./ai-try-on";
import PaymentButton from "./payment-button";
import {
  ArrowLeftIcon,
  CubeFocusIcon,
  PerspectiveIcon,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import YouMayAlsoLike from "@/components/comman/you-may-also-like";

export default function CustomShirtPage() {
  const product_id = "1";
  const [toggle, setToggle] = useState<"details" | "shipping" | "share" | null>(
    null
  );

  const [showIn3D, setShowIn3D] = useState(false);
  const [showAiTryOn, setShowAiTryOn] = useState(false);

  const data = clothes[0];

  if (!product_id) {
    return <>Invalid</>;
  }

  const fadeVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const fadeTransition = {
    duration: 0.4,
    ease: [0.4, 0.0, 0.2, 1],
  };

  return (
    <section className="w-[90%] md:w-[95%] flex flex-col gap-4 mt-12 md:mt-16 mx-auto">
      <div className="w-full flex justify-end relative flex-col md:flex-row z-[1]">
        <div className="w-full m-auto flex flex-col justify-center items-center gap-y-4 z-[2] ">
          <div
            style={{ aspectRatio: "5/6.3" }}
            className=" w-full md:w-[500px] relative md:mr-[100px] max-h-[600px]"
          >
            <AnimatePresence mode="wait">
              {showIn3D ? (
                <motion.div
                  key="3d-viewer"
                  variants={fadeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={fadeTransition}
                  className="h-full"
                >
                  <CustomJeansViewer />
                </motion.div>
              ) : (
                <motion.div
                  key="2d-viewer"
                  variants={fadeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={fadeTransition}
                  className="h-full"
                >
                  <Swiper
                    slidesPerView={1}
                    parallax={true}
                    className="banner-carousel h-full"
                    pagination={{
                      el: ".bullet-buttons",
                      clickable: true,
                      renderBullet: function (index, className) {
                        return (
                          '<span style="width:20px;border-radius:0px;height:2px;background-color:gray;" class="' +
                          className +
                          '">' +
                          "" +
                          "</span>"
                        );
                      },
                    }}
                    modules={[Pagination]}
                  >
                    {data?.images.map((_, id) => (
                      <SwiperSlide className={"h-full"} key={id}>
                        <Image
                          src={_}
                          width={1000}
                          height={1000}
                          className="w-full h-full object-cover"
                          alt="hat"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative z-[100] -top-4 bullet-buttons flex  justify-center items-center gap-4 "></div>
          </div>
          {!showIn3D && (
            <div className="absolute bottom-0 left-0 flex w-full h-full justify-center items-center gap-4">
              <ThreeDButton onClick={() => setShowAiTryOn(true)}>
                AI Try On
              </ThreeDButton>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-[2]">
          <div className="max-w-[450px] sticky top-[90px] md:-translate-x-16 pt-[20px] md:pt-[15vh]">
            <div className="cursor-pointer uppercase text-xs font-semibold flex items-center gap-x-2">
              <ArrowLeftIcon size={16} />
              <span>Back</span>
            </div>
            <div className="flex flex-col gap-y-1">
              {/* <div className="cursor-pointer uppercase text-xs font-semibold">
                FYI
              </div> */}
              <div className="text-2xl font-semibold">{data?.product_name}</div>
              <div className="text-xs text-[#757575]">{data?.price}</div>
            </div>
            <div className="mt-4 flex flex-col gap-y-2 ">
              <motion.button
                onClick={() => setShowIn3D(!showIn3D)}
                className="border w-full flex justify-center items-center gap-2 bg-white text-black p-4 text-xs uppercase font-semibold tracking-[1.1px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {showIn3D ? (
                  <>
                    <PerspectiveIcon size={16} />
                    Back to 2D
                  </>
                ) : (
                  <>
                    <CubeFocusIcon size={16} />
                    View in 3D
                  </>
                )}
              </motion.button>
            </div>

            <p className="mt-4 text-xs">{data?.description}</p>
            <div className="flex gap-4 my-5">
              <PaymentButton />
            </div>

            <div className="mt-4 text-xs">
              <div
                onClick={() =>
                  setToggle((prev) => (prev === "details" ? null : "details"))
                }
                className="uppercase cursor-pointer tracking-[1.1px]"
              >
                Details{" "}
                <span className="text-sm">
                  {toggle === "details" ? "-" : "+"}
                </span>
              </div>
              <div
                className={`ml-4 my-4 cursor-pointer ${
                  toggle === "details" ? "block" : "hidden"
                }`}
              >
                <ul className="list-disc font-semibold">
                  {data?.details.map((d, id) => (
                    <li key={id}>{d}</li>
                  ))}
                </ul>
              </div>

              <div
                onClick={() =>
                  setToggle((prev) => (prev === "shipping" ? null : "shipping"))
                }
                className="uppercase cursor-pointer tracking-[1.1px]"
              >
                Shipping Policy{" "}
                <span className="text-sm">
                  {toggle === "shipping" ? "-" : "+"}
                </span>
              </div>
              <div
                className={`ml-4 my-4 cursor-pointer ${
                  toggle === "shipping" ? "block" : "hidden"
                }`}
              >
                <ul className="list-disc font-semibold">
                  <li>This Product Is Not Available For Immediate Shipment</li>
                  <li>Custom orders may take up to 7 to 10 days to ship</li>
                </ul>
              </div>

              <div
                onClick={() =>
                  setToggle((prev) => (prev === "share" ? null : "share"))
                }
                className="uppercase cursor-pointer tracking-[1.1px]"
              >
                Share{" "}
                <span className="text-sm">
                  {toggle === "share" ? "-" : "+"}
                </span>
              </div>
              <div
                className={`ml-4 my-4 cursor-pointer ${
                  toggle === "share" ? "block" : "hidden"
                }`}
              >
                <ul className="list-disc font-semibold">
                  <a
                    href="https://www.instagram.com/fyi.wearit/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    INSTAGRAM
                  </a>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <YouMayAlsoLike currentProductId={data?.id} />

      {/* AI Try On Dialog */}
      <AiTryOn
        isOpen={showAiTryOn}
        onClose={() => setShowAiTryOn(false)}
        imageUrl={data?.images[0] || ""}
      />
    </section>
  );
}
