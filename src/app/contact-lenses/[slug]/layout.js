
// import { allProducts } from "../../../data/allProducts";
 
// const SITE_URL = "https://lensmartindia.com";

// export async function generateMetadata({ params }) {
//   const { id } = await params;

//   const product = allProducts.find(
//     (item) => String(item.id) === String(id)
//   );

//   if (!product) {
//     return {
//       title: "Product Not Found | LensMartIndia",
//       robots: {
//         index: false,
//         follow: false,
//       },
//     };
//   }

//   const name = product.name || "Contact Lenses";
//   const brand = product.brand || product.manufacturer || "LensMartIndia";
//   const price = Number(product.price || 0);

//   return {
//     title: `${name} | Buy Online at LensMartIndia`,
//     description: `Shop ${name} by ${brand} at LensMartIndia${
//       price > 0 ? ` for ₹${price.toLocaleString("en-IN")}` : ""
//     }. Explore product details and order online.`,
//     alternates: {
//       canonical: `${SITE_URL}/contact-lenses/${id}`,
//     },
//     openGraph: {
//       title: `${name} | LensMartIndia`,
//       description: `Explore ${name} by ${brand} at LensMartIndia.`,
//       url: `${SITE_URL}/contact-lenses/${id}`,
//       type: "website",
//     },
//   };
// }

// export default function ContactLensProductLayout({ children }) {
//   return children;
// }


import { allProducts } from "../../../data/allProducts";

const SITE_URL = "https://lensmartindia.com";

/* page.jsx wala same slug logic */
const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getSlug = (item) =>
  item.slug || slugify(`${item.brand || item.manufacturer || ""} ${item.name || ""} contact lenses`);

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const product = allProducts.find(
    (item) => getSlug(item) === slug
  );

if (!product) {
  const fallbackName = slug
    .replace(/-contact-lenses?(-.*)?$/i, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `${fallbackName} | Buy Online at LensMartIndia`,
    description: `Shop ${fallbackName} contact lenses online at LensMartIndia.`,
    alternates: {
      canonical: `${SITE_URL}/contact-lenses/${slug}`,
    },
    openGraph: {
      title: `${fallbackName} | LensMartIndia`,
      description: `Explore ${fallbackName} contact lenses at LensMartIndia.`,
      url: `${SITE_URL}/contact-lenses/${slug}`,
      type: "website",
    },
  };
}


  const name = product.name || "Contact Lenses";
  const brand = product.brand || product.manufacturer || "LensMartIndia";
  const price = Number(product.price || 0);

  const productUrl = `${SITE_URL}/contact-lenses/${slug}`;

  return {
    title: `${name} | Buy Online at LensMartIndia`,
    description: `Shop ${name} by ${brand} at LensMartIndia${
      price > 0 ? ` for ₹${price.toLocaleString("en-IN")}` : ""
    }. Explore product details and order online.`,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${name} | LensMartIndia`,
      description: `Explore ${name} by ${brand} at LensMartIndia.`,
      url: productUrl,
      type: "website",
    },
  };
}

export default function ContactLensProductLayout({ children }) {
  return children;
}