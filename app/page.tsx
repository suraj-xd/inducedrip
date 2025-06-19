"use client";

import type React from "react";
import Navbar from "@/components/layout/main-page/navbar";
import Footer from "@/components/layout/main-page/footer";
import Image from "next/image";
import { 
  CardCurtainReveal,
  CardCurtainRevealBody,
  CardCurtainRevealDescription,
  CardCurtainRevealFooter,
  CardCurtainRevealTitle,
  CardCurtain } from "@/components/21st/curtain-reveal"

import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"

interface PlacedSticker {
  id: string;
  uniqueKey: string;
  label: string;
  image: string;
}

export default function ViewerPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="flex flex-col items-center justify-center mt-28">
          <Image src="/Frame 41.jpg" alt="AI Try On" width={500} height={500} />
        </div>
        {/* List of models */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto my-12 px-4">
          {/* <Card2 image="/models/1.png" title="HODDIE" href="/shirt" /> */}
          <Card2 image="/models/4.png" title="GreyMatter Suit" href="/hoddie" />
          <Card2 image="/models/3.png" title="HAT" href="/hat" />
          <Card2 image="/models/ChatGPT Image Jun 19, 2025, 03_24_58 PM.png" title="DENIM JACKET" href="/shirt" />
          <Card2 image="/models/5.png" title="NOTE TAKING" href="/diary" />
          <Card2 image="/models/6.png" title="STICKERS" href="/laptop" />

        </div>
      </main>
      <Footer />
    </>
  );
}

function Card2(props: {image: string, title: string, href: string}){
  return(
    <a href={props.href} className="relative w-full bg-white border group overflow-hidden hover:shadow-lg transition-all duration-300">
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
    <div className=" w-full bg-gray-white border-t flex justify-center items-center">
      <p className="text-md font-ppMondwest group-hover:underline py-2">
        {props.title}
      </p>
    </div>
    </div>
  </a>
  )
}

function Card(){
return(
  <div className="min-h-screen place-content-center place-items-center">
  <CardCurtainReveal className="h-[560px] w-96 border border-zinc-100 bg-zinc-950 text-zinc-50 shadow">
    <CardCurtainRevealBody className="">
      <CardCurtainRevealTitle className="text-3xl font-medium tracking-tight">
        the <br />
        hoodie
      </CardCurtainRevealTitle>
      <CardCurtainRevealDescription className="my-4 ">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Accusantium voluptate, eum quia temporibus fugiat rerum nobis modi
          dolor, delectus laboriosam, quae adipisci reprehenderit officiis
          quidem iure ducimus incidunt officia. Magni, eligendi repellendus.
          Fugiat, natus aut?
        </p>
      </CardCurtainRevealDescription>
      <Button
        variant={"secondary"}
        size={"icon"}
        className="aspect-square rounded-full"
      >
        <ArrowUpRight />
      </Button>

      <CardCurtain className=" bg-zinc-50" />
    </CardCurtainRevealBody>

    <CardCurtainRevealFooter className="mt-auto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        width="100%"
        height="100%"
        alt="Tokyo street"
        className=""
        src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
    </CardCurtainRevealFooter>
  </CardCurtainReveal>
</div>
)
}
