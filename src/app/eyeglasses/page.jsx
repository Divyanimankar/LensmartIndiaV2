import EyeglassesClient from "./EyeglassesClient";
import { getEyeglassesProducts } from "@/lib/shopify-products";

export const revalidate = 300;

export default async function EyeglassesPage() {
  const products = await getEyeglassesProducts();

  return <EyeglassesClient products={products} />;
}