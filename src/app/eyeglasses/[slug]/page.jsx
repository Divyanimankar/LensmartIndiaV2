import EyeglassesProductDetails from "./EyeglassesProductDetails";
import {
  getEyeglassesDetail,
  getEyeglassesProducts,
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
   SEO: tab ka title, description, share image, canonical
========================================================= */

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const handle = decodeURIComponent(slug);
  const product = await getEyeglassesDetail(handle);

  if (!product) {
    return {
      title: `Product Not Found | ${BRAND_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.name} | Buy Online at ${BRAND_NAME}`;

  const description = shorten(
    product.description ||
      `Buy ${product.name} eyeglasses${product.brand ? ` by ${product.brand}` : ""} online at ${BRAND_NAME}. Genuine frames, easy lens options and secure checkout.`,
  );

  const url = `${SITE}/eyeglasses/${product.slug || handle}`;
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
      ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
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

export default async function EyeglassesProductPage({ params }) {
  const { slug } = await params;
  const handle = decodeURIComponent(slug);

  const [product, products] = await Promise.all([
    getEyeglassesDetail(handle),
    getEyeglassesProducts(),
  ]);

  /* Google ke liye product ki jaankari (price, stock, image) */
  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: shorten(product.description, 300),
        image: (product.images?.length ? product.images : [product.image]).filter(Boolean),
        ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
        category: "Eyeglasses",
        url: `${SITE}/eyeglasses/${product.slug || handle}`,
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: String(product.price || 0),
          itemCondition: "https://schema.org/NewCondition",
          availability: (product.variants || []).some((v) => v.available)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `${SITE}/eyeglasses/${product.slug || handle}`,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <EyeglassesProductDetails product={product} products={products} />
    </>
  );
}