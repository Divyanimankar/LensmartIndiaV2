import { notFound } from "next/navigation";
import GlassesCatalogPage from "@/components/GlassesCatalogPage";
import { getHeadingParts, getProductsFor } from "@/lib/glassesCatalog";
import {
  getEyeglassesProducts,
  getSunglassesProducts,
} from "@/lib/shopify-products";

/* sunglasses and eyeglasses both come from Shopify */
const loadProducts = async (category) =>
  category === "sunglasses"
    ? await getSunglassesProducts()
    : await getEyeglassesProducts();

export function makeRoute(category, group) {
  return {
    generateMetadata: async ({ params }) => {
      const { slug } = await params;
      const products = await loadProducts(category);
      const { pre, name, post } = getHeadingParts(category, group, slug, products);
      return {
        title: `${pre}${name}${post} | LensMartIndia`,
        description: `Shop ${pre}${name}${post} online at LensMartIndia.`,
      };
    },

    Page: async function Page({ params }) {
      const { slug } = await params;
      const products = await loadProducts(category);

      if (getProductsFor(category, group, slug, products).length === 0) notFound();

      return (
        <GlassesCatalogPage
          category={category}
          group={group}
          slug={slug}
          products={products}
        />
      );
    },
  };
}