import { notFound } from "next/navigation";
import CatalogPage from "@/components/CatalogPage";
import { getAllNames, getDisplayName, getProductsFor } from "@/lib/catalog";
import { createSlug } from "@/lib/slug";

// const TYPE = "brand";

const TYPE = "manufacturer";
export function generateStaticParams() {
  return getAllNames(TYPE).map((name) => ({ slug: createSlug(name) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const name = getDisplayName(TYPE, slug);
  if (!name) return {};
  return {
    title: `${name} Contact Lenses | LensMartIndia`,
    description: `Buy ${name} contact lenses online at LensMartIndia.`,
  };
}

export default async function BrandPage({ params }) {
  const { slug } = await params;
  if (getProductsFor(TYPE, slug).length === 0) notFound();
  return <CatalogPage type={TYPE} slug={slug} />;
}