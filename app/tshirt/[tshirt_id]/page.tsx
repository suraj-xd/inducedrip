import { notFound } from "next/navigation";
import { tshirts } from "@/components/layout/main-page/data";
import ProductDetailsPage from "@/components/product/product-details-page";
import ProductsLayout from "@/components/command-drip/products-layout";
export default function Page({ params }: { params: { tshirt_id: string } }) {
  const tshirt = tshirts.find((t) => t.id === parseInt(params.tshirt_id));

  if (!tshirt) {
    notFound();
  }

  return (
    <ProductsLayout>
      <ProductDetailsPage aiTryOn={true} product={tshirt} />
    </ProductsLayout>
  );
}
