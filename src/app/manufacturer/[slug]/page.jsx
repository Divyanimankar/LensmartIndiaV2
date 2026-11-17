import { notFound } from "next/navigation";
import CatalogPage from "@/components/CatalogPage";
import CategoryDescription from "@/components/CategoryDescription";

import {
  getCatalogProducts,
  filterProductsFor,
  displayNameFor,
  namesFor,
} from "@/lib/catalog";

import { createSlug } from "@/lib/slug";
import { getCollectionFor } from "@/lib/shopify-collections";

const TYPE = "manufacturer";

export async function generateStaticParams() {
  const products = await getCatalogProducts();

  return namesFor(products, TYPE).map((name) => ({
    slug: createSlug(name),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const products = await getCatalogProducts();
  const name = displayNameFor(products, TYPE, slug);

  if (!name) return {};

  const collection = await getCollectionFor(TYPE, slug);

  return {
    title: collection?.seo?.title || `${name} Contact Lenses | LensMartIndia`,
    description:
      collection?.seo?.description ||
      collection?.description ||
      `Buy ${name} contact lenses online at LensMartIndia.`,
  };
}

export default async function ManufacturerPage({ params }) {
  const { slug } = await params;
  const products = await getCatalogProducts();

  if (filterProductsFor(products, TYPE, slug).length === 0) {
    notFound();
  }

  const collection = await getCollectionFor(TYPE, slug);

  return (
    <CatalogPage
      type={TYPE}
      slug={slug}
      products={products}
      description={
        <CategoryDescription
          type={TYPE}
          slug={slug}
          products={products}
          name={displayNameFor(products, TYPE, slug)}
          title={collection?.title}
          descriptionHtml={collection?.descriptionHtml}
          faqs={collection?.faqs}
        />
      }
    />
  );
}