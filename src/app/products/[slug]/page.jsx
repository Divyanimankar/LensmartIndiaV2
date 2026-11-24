import { cache } from "react";
import { notFound, redirect } from "next/navigation";

import EyeglassesProductDetails from "@/app/eyeglasses/[slug]/EyeglassesProductDetails";
import SunglassesProductDetails from "@/app/sunglasses/[slug]/SunglassesProductDetails";
import ContactLensProductDetails from "@/app/contact-lenses/[slug]/ContactLensProductDetails";

import {
  getEyeglassesDetail,
  getEyeglassesProducts,
  getSunglassesDetail,
  getSunglassesProducts,
  getContactLensProducts,
  getContactLensExtras,
} from "@/lib/shopify-products";

export const revalidate = 300;

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://lensmartindia.com").replace(/\/+$/, "");
const BRAND_NAME = "LensMartIndia";

/* description 155 akshar tak (Google itna hi dikhata hai) */
const shorten = (text, max = 155) => {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
};

/* =========================================================
   /products/<handle>
   Shopify handle poore store me unique hota hai, isliye handle se
   pata chal jaata hai ki product Eyeglasses, Sunglasses ya Contact Lens hai.
========================================================= */

const resolveProduct = cache(async (handle) => {
  const [eyeglasses, sunglasses, lenses] = await Promise.all([
    getEyeglassesDetail(handle).catch(() => null),
    getSunglassesDetail(handle).catch(() => null),
    getContactLensProducts().catch(() => []),
  ]);

  if (eyeglasses) return { kind: "eyeglasses", product: eyeglasses };
  if (sunglasses) return { kind: "sunglasses", product: sunglasses };

  /* handle se, ya purane number-wale ID (/products/15391810027629) se */
  const lens = (lenses || []).find(
    (item) => item.slug === handle || String(item.id) === handle,
  );
  if (lens) return { kind: "contact-lenses", product: lens, lenses };

  return null;
});

const NOUN = {
  eyeglasses: "eyeglasses",
  sunglasses: "sunglasses",
  "contact-lenses": "contact lenses",
};

const CATEGORY = {
  eyeglasses: "Eyeglasses",
  sunglasses: "Sunglasses",
  "contact-lenses": "Contact Lenses",
};

/* =========================================================
   SEO: tab ka title, description, share image, canonical
========================================================= */

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const handle = decodeURIComponent(slug);
  const found = await resolveProduct(handle);

  if (!found) {
    return {
      title: `Product Not Found | ${BRAND_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const { kind, product } = found;
  const fullName =
    kind === "contact-lenses" && product.pack
      ? `${product.name} (${product.pack})`
      : product.name;

  const title = `${fullName} | Buy Online at ${BRAND_NAME}`;

  const description = shorten(
    product.description ||
      `Buy ${fullName} ${NOUN[kind]}${product.brand ? ` by ${product.brand}` : ""} online at ${BRAND_NAME}. 100% genuine products and secure checkout.`,
  );

  const url = `${SITE}/products/${product.slug || handle}`;
  const image = product.images?.[0] || product.image;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: BRAND_NAME,
      type: "website",
      ...(image ? { images: [{ url: image, alt: fullName }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const handle = decodeURIComponent(slug);

  const found = await resolveProduct(handle);
  if (!found) notFound();

  const { kind, product } = found;

  /* number-wale ID se aaye ho to sahi handle wale URL pe bhej do */
  if (product.slug && product.slug !== handle) {
    redirect(`/products/${product.slug}`);
  }

  /* Google ke liye product ki jaankari (price, stock, image) */
  const images = (product.images?.length ? product.images : [product.image]).filter(Boolean);
  const url = `${SITE}/products/${product.slug || handle}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: shorten(product.description, 300),
    image: images,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    category: CATEGORY[kind],
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: String(product.price || 0),
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.variants && product.variants.length
          ? product.variants.some((v) => v.available)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url,
    },
  };

  const jsonLdScript = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );

  /* ---------- Eyeglasses ---------- */
  if (kind === "eyeglasses") {
    const products = await getEyeglassesProducts();
    return (
      <>
        {jsonLdScript}
        <EyeglassesProductDetails product={product} products={products} />
      </>
    );
  }

  /* ---------- Sunglasses ---------- */
  if (kind === "sunglasses") {
    const products = await getSunglassesProducts();
    return (
      <>
        {jsonLdScript}
        <SunglassesProductDetails product={product} products={products} />
      </>
    );
  }

  /* ---------- Contact lenses ---------- */
  const extras = await getContactLensExtras(handle);

  /* only the product being viewed gets the extra details */
  const merged = found.lenses.map((item) =>
    item.slug === handle ? { ...item, ...extras } : item,
  );

  return (
    <>
      {jsonLdScript}
      <ContactLensProductDetails products={merged} />
    </>
  );
}