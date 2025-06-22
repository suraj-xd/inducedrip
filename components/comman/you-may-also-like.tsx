"use client"

import Image from "next/image";
import Link from "next/link";
import { clothes, stickers, patches, tshirts } from "../layout/main-page/data";
import { useEffect, useState } from "react";

interface YouMayAlsoLikeProps {
  currentProductId?: number;
}

export default function YouMayAlsoLike({
  currentProductId,
}: YouMayAlsoLikeProps) {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  useEffect(() => {
    const availableProducts = [
      ...clothes,
      ...stickers,
      ...patches,
      ...tshirts,
    ].filter((product) => product.id !== currentProductId);

    const stickersAndPatches = availableProducts.filter(
      (product) => product.id >= 8 && product.id <= 15
    );
    const otherProducts = availableProducts.filter(
      (product) => product.id < 8 || product.id > 15
    );

    const getRandomItems = (array: any[], count: number) => {
      const shuffled = [...array].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    let products: any[] = [];

    const selectedStickersPatches = getRandomItems(stickersAndPatches, 3);
    products.push(...selectedStickersPatches);

    const remainingSlots = 4 - products.length;
    if (remainingSlots > 0) {
      const selectedOthers = getRandomItems(otherProducts, remainingSlots);
      products.push(...selectedOthers);
    }

    if (products.length < 4) {
      const remaining = availableProducts.filter(
        (product) => !products.some((selected) => selected.id === product.id)
      );
      const additionalProducts = getRandomItems(
        remaining,
        4 - products.length
      );
      products.push(...additionalProducts);
    }
    setSelectedProducts(products);
  }, [currentProductId]);

  return (
    <div className="mt-20 flex flex-col gap-3">
      <div className="text-xs tracking-[1px] font-medium">
        YOU MAY ALSO LIKE
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
        {selectedProducts.slice(0, 4).map((product) => (
          <Link
            href={product.href}
            key={product.id}
            className="flex flex-col gap-2 md:pb-10 group cursor-pointer p-5"
          >
            <Image
              src={product.images[0]}
              width={1000}
              height={1000}
              className="w-full h-full object-contain"
              alt={product.product_name}
            />
            <div className="flex flex-col text-xs text-black group-hover:text-[#767676] transition-all duration-150">
              <div className="uppercase leading-4">{product.product_name}</div>
              <div className="leading-4">
                {product.details[0] || "Premium Quality"}
              </div>
              <div className="text-[#757575] mt-1 font-medium tracking-[1.8px]">
                {product.price}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
