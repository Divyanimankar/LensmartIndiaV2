import AllProductsClient from "./AllProductsClient";
import { getContactLensProducts } from "@/lib/shopify-products";

export const revalidate = 300;

export default async function ContactLensesPage() {
  const products = await getContactLensProducts();
  return <AllProductsClient products={products} />;
}