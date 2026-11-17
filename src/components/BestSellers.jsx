import BestSellersClient from "./BestSellersClient";
import {
  getEyeglassesProducts,
  getSunglassesProducts,
} from "@/lib/shopify-products";

const MAX_ITEMS = 10;

/* Shopify tag "bestseller" wale products pehle aate hain; baaki se
   list poori hoti hai. Eyeglasses / sunglasses alternate hote hain. */
const ranked = (list, type) =>
  [...list.filter((p) => p.bestseller), ...list.filter((p) => !p.bestseller)]
    .filter((p) => p.image)
    .map((p) => ({
      type,
      id: p.id,
      slug: p.slug,
      brand: p.brand,
      name: p.name,
      image: p.image,
      shape: p.shape,
      material: p.material,
      frameSize: p.frameSize,
      category: p.category,
      price: p.price,
      oldPrice: p.oldPrice,
      colors: p.colors,
      rating: p.rating,
    }));

export default async function BestSellers() {
  const [eyeglasses, sunglasses] = await Promise.all([
    getEyeglassesProducts(),
    getSunglassesProducts(),
  ]);

  const a = ranked(eyeglasses, "eyeglasses");
  const b = ranked(sunglasses, "sunglasses");

  const items = [];
  for (let i = 0; items.length < MAX_ITEMS && (i < a.length || i < b.length); i++) {
    if (a[i]) items.push(a[i]);
    if (b[i] && items.length < MAX_ITEMS) items.push(b[i]);
  }

  return <BestSellersClient items={items} />;
}