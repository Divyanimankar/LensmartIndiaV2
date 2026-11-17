import SunglassesProductDetails from "./SunglassesProductDetails";
import {
  getSunglassesDetail,
  getSunglassesProducts,
} from "@/lib/shopify-products";

export const revalidate = 300;

export default async function SunglassesProductPage({ params }) {
  const { slug } = await params;

  const [product, products] = await Promise.all([
    getSunglassesDetail(decodeURIComponent(slug)),
    getSunglassesProducts(),
  ]);

  return <SunglassesProductDetails product={product} products={products} />;
}