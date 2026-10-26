import { notFound } from "next/navigation";
import CatalogPage from "@/components/CatalogPage";
import { getDisplayName, getProductsFor } from "@/lib/catalog";
import { LENS_TYPES } from "@/lib/lensTypes";

const TYPE = "lens-type";

export function generateStaticParams() {
  return LENS_TYPES.map((t) => ({ slug: t.slug }));
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

export default async function LensTypePage({ params }) {
  const { slug } = await params;
  if (getProductsFor(TYPE, slug).length === 0) notFound();
  return <CatalogPage type={TYPE} slug={slug} />;
}