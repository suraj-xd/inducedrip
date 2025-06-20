"use client"

import { useEffect } from "react"
import { motion, stagger, useAnimate } from "framer-motion"
import { useRouter } from "next/navigation"

import Floating, {
  FloatingElement,
} from "@/components/21st/parallax-floating"
import { clothes } from "@/components/layout/main-page/data"
import Image from "next/image"
import AnimatedScreen from "@/components/codex/animated-screen"
import { FollowerPointerCard } from "@/components/comman/following-pointer"
import Link from "next/link"

// Arrow component for the pointer
const ArrowUpRight = () => (
  <div className="flex items-center space-x-1">
    <span>↗</span>
  </div>
)

// Title component with product name and arrow
const ProductTitle = ({ title }: { title: string }) => (
  <div className="flex items-center space-x-2">
    <span className="text-sm font-medium">{title}</span>
    <ArrowUpRight />
  </div>
)

// Hardcoded product images from the data
const productImages = [
  {
    url: "/models/4.png",
    href: "/hoddie",
    title: "GreyMatter Suit",
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
    title: "INDCD CAP",
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
      className="flex w-full h-full min-h-screen justify-center items-center bg-white overflow-hidden"
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
        {/* <Image src={"/models/Frame 52.svg"} width={400} height={400} alt="fyi-text" /> */}

        <Link 
          className="text-xs z-50 hover:scale-110 transition-transform border bg-white text-black rounded-full py-2 w-fit px-4 cursor-pointer"
          href={"/all"}
        >
          Explore all products
        </Link>
      </motion.div>

      <Floating sensitivity={-1} className="overflow-hidden">
        <FloatingElement depth={0.5} className="cursor-none top-[15%] left-[10%]">
          <FollowerPointerCard title={<ProductTitle title={productImages[0]?.title} />}>
            <motion.img
              initial={{ opacity: 0 }}
              src={productImages[0]?.url}
              className="w-[100px] h-fit md:w-[200px] object-cover hover:scale-105 duration-200 cursor-none transition-transform"
              onClick={() => handleImageClick(productImages[0]?.href)}
              alt={productImages[0]?.title}
            />
          </FollowerPointerCard>
        </FloatingElement>
        <FloatingElement depth={1} className="cursor-none top-[10%] left-[32%]">
          <FollowerPointerCard title={<ProductTitle title={productImages[1]?.title} />}>
            <motion.img
              initial={{ opacity: 0 }}
              src={productImages[1]?.url}
              className="w-16 h-16 md:w-20 md:h-20 object-cover hover:scale-105 duration-200 cursor-none transition-transform"
              onClick={() => handleImageClick(productImages[1]?.href)}
              alt={productImages[1]?.title}
            />
          </FollowerPointerCard>
        </FloatingElement>
        <FloatingElement depth={2} className="cursor-none top-[2%] left-[53%]">
          <FollowerPointerCard title={<ProductTitle title={productImages[2]?.title} />}>
            <motion.img
              initial={{ opacity: 0 }}
              src={productImages[2]?.url}
              className="w-28 h-40 md:w-40 md:h-52 object-cover hover:scale-105 duration-200 cursor-none transition-transform"
              onClick={() => handleImageClick(productImages[2]?.href)}
              alt={productImages[2]?.title}
            />
          </FollowerPointerCard>
        </FloatingElement>
        <FloatingElement depth={1} className="cursor-none top-[20%] left-[83%]">
          <FollowerPointerCard title={<ProductTitle title={productImages[8]?.title} />}>
            <motion.img
              initial={{ opacity: 0 }}
              src={productImages[8]?.url}
              className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-none transition-transform"
              onClick={() => handleImageClick(productImages[8]?.href)}
              alt={productImages[8]?.title}
            />
          </FollowerPointerCard>
        </FloatingElement>

        <FloatingElement depth={1} className="cursor-none top-[30%] left-[30%] md:left-[40%]">
          <FollowerPointerCard title={<ProductTitle title={productImages[4]?.title} />}>
            <motion.img
              initial={{ opacity: 0 }}
              src={productImages[4]?.url}
              className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] object-cover hover:scale-105 duration-200 cursor-none transition-transform"
              onClick={() => handleImageClick(productImages[4]?.href)}
              alt={productImages[4]?.title}
            />
          </FollowerPointerCard>
        </FloatingElement>
        <FloatingElement depth={2} className="cursor-none top-[70%] left-[77%]">
          <FollowerPointerCard title={<ProductTitle title={productImages[5]?.title} />}>
            <motion.img
              initial={{ opacity: 0 }}
              src={productImages[5]?.url}
              className="w-[150px] h-[150px] md:w-[320px] md:h-[320px] object-cover hover:scale-105 duration-200 cursor-none transition-transform"
              onClick={() => handleImageClick(productImages[5]?.href)}
              alt={productImages[5]?.title}
            />
          </FollowerPointerCard>
        </FloatingElement>

        <FloatingElement depth={4} className="cursor-none top-[73%] left-[25%]">
          <FollowerPointerCard title={<ProductTitle title={productImages[6]?.title} />}>
            <motion.img
              initial={{ opacity: 0 }}
              src={productImages[6]?.url}
              className="w-40 md:w-52 h-full object-cover hover:scale-105 duration-200 cursor-none transition-transform"
              onClick={() => handleImageClick(productImages[6]?.href)}
              alt={productImages[6]?.title}
            />
          </FollowerPointerCard>
        </FloatingElement>
        <FloatingElement depth={1} className="cursor-none top-[80%] left-[50%]">
          <FollowerPointerCard title={<ProductTitle title={productImages[7]?.title} />}>
            <motion.img
              initial={{ opacity: 0 }}
              src={productImages[7]?.url}
              className="w-16 h-16 md:w-20 md:h-20 object-cover hover:scale-105 duration-200 cursor-none transition-transform"
              onClick={() => handleImageClick(productImages[7]?.href)}
              alt={productImages[7]?.title}
            />
          </FollowerPointerCard>
        </FloatingElement>
      </Floating>
    </div>
  )
}

