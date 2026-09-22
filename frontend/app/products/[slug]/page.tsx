import type { Metadata } from "next";
import { ProductDetails } from "@/components/ProductDetails";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: "Product | Hassan Electric & Traders", description: `View product details, colors, sizes and availability for ${slug.replaceAll("-", " ")} in Islamabad.` };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetails slug={slug} />;
}
