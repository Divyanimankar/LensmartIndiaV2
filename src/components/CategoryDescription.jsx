import CollectionDescription from "@/components/CollectionDescription";
import { filterProductsFor } from "@/lib/catalog";
import { getCatalogContent } from "@/data/catalogContent";

const BASE_PATH = {
  brand: "brands",
  "lens-type": "lens-type",
  manufacturer: "manufacturer",
};

export default function CategoryDescription({
  type,
  slug,
  name,
  title,
  descriptionHtml,
  faqs = [],
  products = [],
}) {
  // products prop se (Shopify), sirf isi page ke
  const scoped = filterProductsFor(products, type, slug);

  const override = {
    ...getCatalogContent(type, slug, name),
    ...(faqs.length > 0 && { faqs }),
  };

  return (
    <CollectionDescription
      type="contact-lenses"
      products={scoped}
      override={override}
      url={`/${BASE_PATH[type]}/${slug}`}
      title={descriptionHtml ? title : undefined}
      descriptionHtml={descriptionHtml}
    />
  );
}