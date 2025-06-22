"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";

import Floating, { FloatingElement } from "@/components/21st/parallax-floating";
import { FollowerPointerCard } from "@/components/comman/following-pointer";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

const ProductTitle = ({ title }: { title: string }) => (
  <div className="flex items-center space-x-2">
    <span className="text-sm font-medium">{title}</span>
    <ArrowUpRightIcon className="w-4 h-4" />
  </div>
);

const productImages = [
  {
    url: "/models/4.png",
    href: "/graymatter-suit",
    title: "GreyMatter Suit",
    price: "₹2999.00",
    id: 1,
  },
  {
    url: "/sticker/list/induced-logo.png",
    href: "/patch/13",
    title: "Induced Logo",
    price: "₹299.00",

    id: 2,
  },
  {
    url: "/diary/diary.png",
    href: "/notebook",
    title: "Notebook",
    price: "₹3699.00",
    id: 3,
  },
  {
    url: "/hoodie/Frame 1145.png",
    href: "/hoddie",
    title: "Hoddie",
    price: "₹3699.00",
    id: 4,
  },
  {
    url: "/tshirt/Frame 52.png",
    href: "/tshirt/7",
    title: "Overisze Drip Tee",
    price: "₹3699.00",

    id: 5,
  },
  {
    url: "/tshirt/Frame 50.png",
    href: "/tshirt/6",
    title: "Classic Tee",
    price: "₹3699.00",
    id: 6,
  },
  {
    url: "/sticker/cover/Frame 55.png",
    href: "/laptop",
    title: "Laptop Stickers",
    price: "₹3699.00",
    id: 7,
  },
  {
    url: "/sticker/list/star.png",
    href: "/patch/11",
    title: "Ronika Patch",
    price: "₹299.00",
    id: 8,
  },
  {
    url: "/chatgpt-hat-2.png",
    href: "/cap",
    title: "INDCD CAP",
    price: "₹1999.00",
    id: 9,
  },
  {
    url: "/chatgpt-jacket.png",
    href: "/jacket",
    title: "Denim Jacket",
    price: "₹1999.00",
    id: 10,
  },
];

const floatingProducts = [
  {
    ...productImages[0], // GREYMATTER SUIT
    depth: 0.5,
    positionClassName: "top-[15%] left-[0] md:left-[10%]",
    imageClassName: "w-[150px] md:w-[200px]",
  },
  {
    ...productImages[1], // INDUCED LOGO
    depth: 1,
    positionClassName: "top-[10%] left-[32%]",
    imageClassName: "w-16 h-16 md:w-20 md:h-20",
  },
  {
    ...productImages[2], // BOOK
    depth: 2,
    positionClassName: "top-[2%] left-[53%]",
    imageClassName: "w-28 h-40 md:w-40 md:h-52",
  },
  {
    ...productImages[9], // DENIM JACKET
    depth: 1,
    positionClassName: "top-[25%] left-[83%]",
    imageClassName: "w-24 h-24 md:w-60 md:h-60 rotate-[-10deg]",
  },
  {
    ...productImages[8], // INDCD CAP
    depth: 1,
    positionClassName: "top-[10%] left-[73%]",
    imageClassName: "w-24 h-24 md:w-32 md:h-32 rotate-[10deg]",
  },
  {
    ...productImages[4], // OVERISZE DRIP TEE
    depth: 1,
    positionClassName: "top-[30%] left-[32%] md:left-[40%]",
    imageClassName: "w-[200px] h-[200px] md:w-[400px] md:h-[400px]",
  },
  {
    ...productImages[5], // CLASSIC TEE
    depth: 2,
    positionClassName: "top-[70%] left-[77%]",
    imageClassName: "w-[150px] h-[150px] md:w-[320px] md:h-[320px]",
  },
  {
    ...productImages[6], // LAPTOP STICKERS
    depth: 4,
    positionClassName: "top-[73%] left-[25%]",
    imageClassName: "w-40 md:w-52 h-full",
  },
  {
    ...productImages[7], // RONIKA PATCH
    depth: 1,
    positionClassName: "top-[80%] left-[50%]",
    imageClassName: "w-16 h-16 md:w-20 md:h-20",
  },
];

export default function Preview() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      "img",
      { opacity: [0, 1] },
      { duration: 0.5, delay: stagger(0.15) }
    );
  }, []);

  return (
    <div
      className="flex w-full h-full min-h-screen justify-center items-center bg-white overflow-hidden"
      ref={scope}
    >
      <motion.div
        className="z-50 text-center space-y-4 items-center flex flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 1.5 }}
      >
        <Link
          className="text-xs z-50 hover:scale-110 transition-transform border bg-white text-black rounded-full py-2 w-fit px-4 cursor-pointer"
          href={"/all"}
        >
          Explore all products
        </Link>
      </motion.div>

      <Floating sensitivity={-1} className="overflow-hidden">
        {floatingProducts.map((product) => (
          <FloatingElement
            key={product.id}
            depth={product.depth}
            className={`cursor-none ${product.positionClassName}`}
          >
            <FollowerPointerCard
              title={<ProductTitle title={product.title} />}
            >
              <Link href={product.href}>
                <motion.img
                  initial={{ opacity: 0 }}
                  src={product.url}
                  className={`${product.imageClassName} object-cover hover:scale-105 duration-200 cursor-none transition-transform`}
                  alt={product.title}
                />
              </Link>
            </FollowerPointerCard>
          </FloatingElement>
        ))}
      </Floating>
    </div>
  );
}
