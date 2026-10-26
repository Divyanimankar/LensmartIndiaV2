import { notFound } from "next/navigation";
import GlassesCatalogPage from "@/components/GlassesCatalogPage";
import { getHeadingParts, getProductsFor } from "@/lib/glassesCatalog";

export function makeRoute(category, group) {
  return {
    generateMetadata: async ({ params }) => {
      const { slug } = await params;
      const { pre, name, post } = getHeadingParts(category, group, slug);
      return {
        title: `${pre}${name}${post} | LensMartIndia`,
        description: `Shop ${pre}${name}${post} online at LensMartIndia.`,
      };
    },

    Page: async function Page({ params }) {
      const { slug } = await params;
      if (getProductsFor(category, group, slug).length === 0) notFound();
      return <GlassesCatalogPage category={category} group={group} slug={slug} />;
    },
  };
}