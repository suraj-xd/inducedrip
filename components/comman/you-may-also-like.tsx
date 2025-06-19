import Image from "next/image";
import Link from "next/link";
import { clothes } from "../layout/main-page/data";

interface YouMayAlsoLikeProps {
  currentProductId?: number;
}

export default function YouMayAlsoLike({ currentProductId }: YouMayAlsoLikeProps) {
  // Filter out current product and separate stickers/patches from other products
  const availableProducts = clothes.filter(product => product.id !== currentProductId);
  
  // Stickers and patches are typically IDs 8-15 based on the data
  const stickersAndPatches = availableProducts.filter(product => product.id >= 8 && product.id <= 15);
  const otherProducts = availableProducts.filter(product => product.id < 8 || product.id > 15);
  
  // Function to get random items from an array
  const getRandomItems = (array: any[], count: number) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  // Prioritize stickers and patches, then fill with other products
  let selectedProducts = [];
  
  // Try to get 3 stickers/patches first
  const selectedStickersPatches = getRandomItems(stickersAndPatches, 3);
  selectedProducts.push(...selectedStickersPatches);
  
  // Fill remaining slots with other products
  const remainingSlots = 4 - selectedProducts.length;
  if (remainingSlots > 0) {
    const selectedOthers = getRandomItems(otherProducts, remainingSlots);
    selectedProducts.push(...selectedOthers);
  }
  
  // If we still don't have 4 products, fill with any remaining products
  if (selectedProducts.length < 4) {
    const remaining = availableProducts.filter(product => 
      !selectedProducts.some(selected => selected.id === product.id)
    );
    const additionalProducts = getRandomItems(remaining, 4 - selectedProducts.length);
    selectedProducts.push(...additionalProducts);
  }

  return (
    <div className="mt-20 flex flex-col gap-3">
      <div className="text-xs tracking-[1px] font-medium">
        YOU MAY ALSO LIKE
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
        {selectedProducts.slice(0, 4).map((product) => (
          <Link
            href={`/product/${product.id}`}
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
              <div className="leading-4">{product.details[0] || 'Premium Quality'}</div>
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
