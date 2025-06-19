"use client"

import { useEffect } from "react"
import { motion, stagger, useAnimate } from "framer-motion"
import { useRouter } from "next/navigation"

import Floating, {
  FloatingElement,
} from "@/components/21st/parallax-floating"
import { clothes } from "@/components/layout/main-page/data"
import Image from "next/image"

// Hardcoded product images from the data
const productImages = [
  {
    url: "/hoodie/Frame 1145.png",
    href: "/shirt",
    title: "Basic T-Shirt",
    price: "₹2999.00",
    id: 1
  },
  {
    url: "/sticker/list/induced-logo.png",
    href: "/patch-2",
    title: "Induced Logo",
    price: "₹299.00",
   
    id: 2
  },
  {
    url: "/diary/diary.png",
    href: "/diary",
    title: "Book",
    price: "₹3699.00",
    id: 3
  },
  {
    url: "/hoodie/Frame 1145.png",
    href: "/hoddie",
    title: "Hoddie",
    price: "₹3699.00",
    id: 4
  },
  {
    url: "/tshirt/Frame 52.svg",
    href: "/tshirt-2",
    title: "Overisze Drip Tee",
    price: "₹3699.00",
   
    id: 5
  },
  {
    url: "/tshirt/Frame 50.svg",
    href: "/tshirt-1",
    title: "Classic Tee",
    price: "₹3699.00",
    id: 6
  },
  {
    url: "/sticker/cover/Frame 55.svg",
    href: "/laptop",
    title: "Laptop Stickers",
    price: "₹3699.00",
    id: 7
  },
  {
    url: "/sticker/list/star.png",
    href: "/patch-1",
    title: "Ronika Patch",
    price: "₹299.00",
    id: 8
  },
  {
    url: "/hat/hat-2.png",
    href: "/hat",
    title: "Sweat Shirt",
    price: "₹2999.00",
    id: 9
  }
]

export default function Preview() {
  const [scope, animate] = useAnimate()
  const router = useRouter()

  useEffect(() => {
    animate("img", { opacity: [0, 1] }, { duration: 0.5, delay: stagger(0.15) })
  }, [])

  const handleImageClick = (href: string) => {
    router.push(href)
  }

  return (
    <div
      className="flex w-full h-full min-h-screen justify-center items-center bg-black overflow-hidden"
      ref={scope}
    >
      <motion.div
        className="z-50 text-center space-y-4 items-center flex flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 1.5 }}
      >
        {/* <p className="text-5xl md:text-7xl z-50 text-white font-calendas italic">
          inducedrip.
        </p> */}
        <Image src={"/models/Frame 60.svg"} width={400} height={400} alt="fyi-text" />

        <p 
          className="text-xs z-50 hover:scale-110 transition-transform bg-white text-black rounded-full py-2 w-fit px-4 cursor-pointer"
          onClick={() => router.push('/')}
        >
          Explore all products
        </p>
      </motion.div>

      <Floating sensitivity={-1} className="overflow-hidden">
        <FloatingElement depth={0.5} className="top-[8%] left-[11%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={productImages[0]?.url}
            className="w-16 h-16 md:w-24 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
            onClick={() => handleImageClick(productImages[0]?.href)}
            alt={productImages[0]?.title}
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[10%] left-[32%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={productImages[1]?.url}
            className="w-20 h-20 md:w-28 md:h-28 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
            onClick={() => handleImageClick(productImages[1]?.href)}
            alt={productImages[1]?.title}
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[2%] left-[53%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={productImages[2]?.url}
            className="w-28 h-40 md:w-40 md:h-52 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
            onClick={() => handleImageClick(productImages[2]?.href)}
            alt={productImages[2]?.title}
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[20%] left-[83%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={productImages[8]?.url}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
            onClick={() => handleImageClick(productImages[8]?.href)}
            alt={productImages[8]?.title}
          />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[40%] left-[2%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={productImages[4]?.url}
            className="w-28 h-28 md:w-36 md:h-36 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
            onClick={() => handleImageClick(productImages[4]?.href)}
            alt={productImages[4]?.title}
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[70%] left-[77%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={productImages[5]?.url}
            className="w-28 h-28 md:w-36 md:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
            onClick={() => handleImageClick(productImages[5]?.href)}
            alt={productImages[5]?.title}
          />
        </FloatingElement>

        <FloatingElement depth={4} className="top-[73%] left-[25%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={productImages[6]?.url}
            className="w-40 md:w-52 h-full object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
            onClick={() => handleImageClick(productImages[6]?.href)}
            alt={productImages[6]?.title}
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[80%] left-[50%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={productImages[7]?.url}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
            onClick={() => handleImageClick(productImages[7]?.href)}
            alt={productImages[7]?.title}
          />
        </FloatingElement>
      </Floating>
    </div>
  )
}

