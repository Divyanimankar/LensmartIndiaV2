import ContactLensProductDetails from "./ContactLensProductDetails";
import {
  getContactLensProducts,
  getContactLensExtras,
} from "@/lib/shopify-products";

export const revalidate = 300; // refresh from Shopify every 5 minutes

export default async function ContactLensPage({ params }) {
  const { slug } = await params;
  const handle = decodeURIComponent(slug);

  const [products, extras] = await Promise.all([
    getContactLensProducts(),
    getContactLensExtras(handle),
  ]);

  /* only the product being viewed gets the extra details */
  const merged = products.map((item) =>
    item.slug === handle ? { ...item, ...extras } : item,
  );

  return <ContactLensProductDetails products={merged} />;
}