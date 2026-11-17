import { NextResponse } from "next/server";
import { getContactLensProducts } from "@/lib/shopify-products";

/* Contact-lens products from Shopify, for client components
   (e.g. the "Most loved contact lenses" slider on the home page). */

export const revalidate = 300; // refresh from Shopify every 5 minutes

export async function GET() {
  try {
    const products = await getContactLensProducts();

    return NextResponse.json(
      products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        pack: p.pack,
        brand: p.brand,
        manufacturer: p.manufacturer,
        type: p.type,
        replacementSchedule: p.replacementSchedule,
        isColor: p.isColor,
        price: p.price,
        oldPrice: p.oldPrice,
        image: p.image,
        bestseller: p.bestseller,
      })),
    );
  } catch (error) {
    console.error("contact-lenses api error:", error);
    return NextResponse.json([], { status: 500 });
  }
}