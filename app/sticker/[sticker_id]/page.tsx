import { notFound } from "next/navigation";
import { stickers } from "@/components/layout/main-page/data";
import ProductDetailsPage from "@/components/product/product-details-page";
import ProductsLayout from "@/components/command-drip/products-layout";
export default function Page({ params }: { params: { sticker_id: string } }) {
  const sticker = stickers.find((s) => s.id === parseInt(params.sticker_id));

  if (!sticker) {
    notFound();
  }

  return (
    <ProductsLayout>
      <ProductDetailsPage aiTryOn={false} product={sticker} />
    </ProductsLayout>
  );
}