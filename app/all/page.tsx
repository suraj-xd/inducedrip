"use client";

import type React from "react";
import Navbar from "@/components/layout/main-page/navbar";
import Footer from "@/components/layout/main-page/footer";
import Image from "next/image";

export default function ViewerPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="flex flex-col items-center justify-center mt-28">
          <h1 className="text-4xl text-left font-bold font-ppMondwest">
            All Products<span className="text-green-400">.</span>{" "}
          </h1>
        </div>
        {/* List of models */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto my-12 px-4">
          <Card2
            image="/models/4.png"
            title="GreyMatter Suit"
            href="/hoddie"
            price="₹3699.00"
          />
          <Card2
            image="/models/3.png"
            title="HAT"
            href="/hat"
            price="₹3699.00"
          />
          <Card2
            image="/models/ChatGPT Image Jun 19, 2025, 03_24_58 PM.png"
            title="DENIM JACKET"
            href="/shirt"
            price="₹3699.00"
          />
          <Card2
            image="/diary/diary.png"
            title="NOTE TAKING"
            href="/diary"
            price="₹3699.00"
          />
          <Card2
            image="/sticker/cover/Frame 55.svg"
            title="STICKERS"
            href="/laptop"
            price="₹3699.00"
          />
          <Card2
            image="/models/Frame 50.svg"
            title="CLASSIC TEE"
            href="/tshirt-1"
            price="₹3699.00"
          />
          <Card2
            image="/models/Frame 52.svg"
            title="OVERISZE DRIP TEE"
            href="/tshirt-2"
            price="₹3699.00"
          />
          <Card2
            image="/patches/chatgpt/ChatGPT Image Jun 19, 2025, 01_23_20 PM Background Removed.png"
            title="RONIKA PATCH"
            href="/patch-1"
            price="₹3699.00"
          />
          <Card2
            image="/patches/chatgpt/ChatGPT Image Jun 19, 2025, 01_16_13 PM.png"
            title="DNTEL PATCH"
            href="/patch-2"
            price="₹3699.00"
          />
          <Card2
            image="/patches/chatgpt/ChatGPT Image Jun 19, 2025, 01_28_09.png"
            title="RONIKA PATCH BLUE"
            href="/patch-3"
            price="₹3699.00"
          />
          <Card2
            image="/sticker/list/star.png"
            title="RONIKA PATCH BLACK"
            href="/patch-4"
            price="₹3699.00"
          />
          <Card2
            image="/sticker/list/star-2.png"
            title="STAR GOLDEN STICKER"
            href="/sticker-1"
            price="₹3699.00"
          />
          <Card2
            image="/sticker/list/induced-logo.png"
            title="PATCH INDUCED LOGO"
            href="/patch-5"
            price="₹3699.00"
          />
          <Card2
            image="/sticker/list/ronika-1.png"
            title="PATCH RONIKA BROWN"
            href="/patch-6"
            price="₹3699.00"
          />
          <Card2
            image="/sticker/list/induced-drip.png"
            title="INDUCED DRIP STICKER"
            href="/sticker-2"
            price="₹3699.00"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

function Card2(props: {
  image: string;
  title: string;
  href: string;
  price: string;
}) {
  return (
    <a
      href={props.href}
      className="relative w-full bg-white border group overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="p-4 flex justify-center items-center pb-10">
        <Image
          src={props.image}
          className="hover:scale-105 transition-all duration-300 cursor-pointer"
          alt="AI Try On"
          width={300}
          height={300}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <div className=" w-full bg-gray-white border-t flex justify-between items-center px-4">
          <p className="text-md font-ppMondwest group-hover:underline py-2">
            {props.title}
          </p>
          <p className="text-sm font-mono group-hover:underline py-2 opacity-50">
            {" "}
            {props.price}{" "}
          </p>
        </div>
      </div>
    </a>
  );
}
