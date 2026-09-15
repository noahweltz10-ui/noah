import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { getProduct } from "@/lib/shopify";
import { FALLBACK_PRODUCTS } from "@/lib/shopify-fallback";

export function generateStaticParams() {
  return FALLBACK_PRODUCTS.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const { product } = await getProduct(handle);
  if (!product) return {};

  return {
    title: product.title,
    description: product.description || undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const { product } = await getProduct(handle);
  if (!product) notFound();

  return (
    <>
      <Nav />
      <main id="main">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </>
  );
}
