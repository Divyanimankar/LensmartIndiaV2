import SunglassesClient from "./SunglassesClient";
import { getSunglassesProducts } from "@/lib/shopify-products";

export const revalidate = 300;

export default async function SunglassesPage() {
  const products = await getSunglassesProducts();

  return <SunglassesClient products={products} />;
}