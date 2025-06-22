"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProductImageSwiperProps {
  images: string[];
}

export default function ProductImageSwiper({
  images,
}: ProductImageSwiperProps) {
  return (
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
      {images?.map((_, id) => (
        <SwiperSlide className={"h-full"} key={id}>
          <Image
            src={_}
            width={1000}
            height={1000}
            className="w-full h-full object-contain"
            alt="hat"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
} 