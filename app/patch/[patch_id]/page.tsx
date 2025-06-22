import { notFound } from "next/navigation";
import { patches } from "@/components/layout/main-page/data";
import ProductDetailsPage from "@/components/product/product-details-page";
import ProductsLayout from "@/components/command-drip/products-layout";
export default function Page({ params }: { params: { patch_id: string } }) {
  const patch = patches.find((p) => p.id === parseInt(params.patch_id));

  if (!patch) {
    notFound();
  }

  return (
    <ProductsLayout>
      <ProductDetailsPage aiTryOn={false} product={patch} />
    </ProductsLayout>
  );
}
