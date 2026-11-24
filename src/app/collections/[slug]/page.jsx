import { notFound } from "next/navigation";
import CatalogPage from "@/components/CatalogPage";
import CategoryDescription from "@/components/CategoryDescription";

import {
  getCatalogProducts,
  displayNameFor,
  namesFor,
} from "@/lib/catalog";

import { getCollectionFor } from "@/lib/shopify-collections";

/* =========================================================
   /collections/<naam>  ->  Brand ya Manufacturer ka page
   (eyeglasses / sunglasses / contact-lenses / lens type ke
    collection URLs next.config.mjs ke rewrites se pehle hi chal jaate hain)
========================================================= */

const keyOf = (v) => String(v ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

/* slug se pata lagao ki ye brand hai ya manufacturer */
async function resolveCollection(slug) {
  const products = await getCatalogProducts();
  const key = keyOf(decodeURIComponent(slug));
  if (!key) return null;

  const brands = namesFor(products, "brand");
  const makers = namesFor(products, "manufacturer");

  const exact = (list) => list.find((n) => keyOf(n) === key);
  const loose = (list) =>
    key.length >= 4
      ? list.find((n) => {
          const k = keyOf(n);
          return k.startsWith(key) || key.startsWith(k);
        })
      : null;

  const pick =
    (exact(brands) && { type: "brand", name: exact(brands) }) ||
    (exact(makers) && { type: "manufacturer", name: exact(makers) }) ||
    (loose(brands) && { type: "brand", name: loose(brands) }) ||
    (loose(makers) && { type: "manufacturer", name: loose(makers) });

  if (!pick) return null;

  return { products, type: pick.type, slug: keyOf(pick.name), name: pick.name };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const found = await resolveCollection(slug);
  if (!found) return {};

  const name = displayNameFor(found.products, found.type, found.slug) || found.name;
  const collection = await getCollectionFor(found.type, found.slug);

  return {
    title: collection?.seo?.title || `${name} Contact Lenses | LensMartIndia`,
    description:
      collection?.seo?.description ||
      collection?.description ||
      `Buy ${name} contact lenses online at LensMartIndia.`,
  };
}

export default async function CollectionPage({ params }) {
  const { slug } = await params;
  const found = await resolveCollection(slug);
  if (!found) notFound();

  const { products, type, slug: realSlug } = found;
  const collection = await getCollectionFor(type, realSlug);

  return (
    <CatalogPage
      type={type}
      slug={realSlug}
      products={products}
      description={
        <CategoryDescription
          type={type}
          slug={realSlug}
          products={products}
          name={displayNameFor(products, type, realSlug)}
          title={collection?.title}
          descriptionHtml={collection?.descriptionHtml}
          faqs={collection?.faqs}
        />
      }
    />
  );
}