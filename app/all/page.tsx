"use client";

import type React from "react";
import Navbar from "@/components/layout/main-page/navbar";
import Footer from "@/components/layout/main-page/footer";
import Image from "next/image";
import {
  clothes,
  tshirts,
  stickers,
  patches,
} from "@/components/layout/main-page/data";

const allProducts = [...clothes, ...tshirts, ...stickers, ...patches];

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
          {allProducts.map((product) => (
            <Card2
              key={product.id}
              image={product.images[0]}
              title={product.product_name}
              href={product.href}
              price={product.price}
            />
          ))}
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
