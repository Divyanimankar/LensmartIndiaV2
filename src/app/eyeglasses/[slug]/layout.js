// import { eyeglassesProducts } from "../../../data/eyeglassesProducts";

// const SITE_URL = "https://lensmartindia.com";

// export async function generateMetadata({ params }) {
//   const { id } = await params;

//   const product = eyeglassesProducts.find(
//     (item) => String(item.id) === String(id)
//   );

//   if (!product) {
//     return {
//       title: "Product Not Found",
//       robots: {
//         index: false,
//         follow: false,
//       },
//     };
//   }

//   const name = product.name || "Eyeglasses";
//   const brand = product.brand || product.manufacturer || "LensMartIndia";
//   const price = Number(product.price || 0);
//   const title = `${name} | Buy Online at LensMartIndia`;

//   return {
//     title,
//     description: `Shop ${name} by ${brand} at LensMartIndia${
//       price > 0 ? ` for ₹${price.toLocaleString("en-IN")}` : ""
//     }. Explore stylish eyeglasses and order online.`,
//     alternates: {
//       canonical: `${SITE_URL}/eyeglasses/${id}`,
//     },
//     openGraph: {
//       title,
//       description: `Explore ${name} by ${brand} at LensMartIndia.`,
//       url: `${SITE_URL}/eyeglasses/${id}`,
//       type: "website",
//     },
//   };
// }

// export default function EyeglassesProductLayout({ children }) {
//   return children;
// }


// ------------------------------- NEW PAth----------------------------------

import { eyeglassesProducts } from "../../../data/eyeglassesProducts";

const SITE_URL = "https://lensmartindia.com";

/* page.jsx wala hi slug logic - dono jagah same hona chahiye */
const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getSlug = (item) => {
  if (item.slug) return item.slug;

  const name = String(item.name || "");
  const brand = String(item.brand || "");
  const nameHasBrand = name.toLowerCase().startsWith(brand.toLowerCase());

  return slugify(`${nameHasBrand ? name : `${brand} ${name}`} eyeglasses`);
};

export async function generateMetadata({ params }) {
  const { slug } = await params;

  /* slug se dhundo; purane /eyeglasses/1 links ke liye id se bhi */
  const product = eyeglassesProducts.find(
    (item) => getSlug(item) === slug || String(item.id) === String(slug)
  );

  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const name = product.name || "Eyeglasses";
  const brand = product.brand || product.manufacturer || "LensMartIndia";
  const price = Number(product.price || 0);
  const title = `${name} | Buy Online at LensMartIndia`;

  /* canonical hamesha slug wala URL - id wala URL bhi usi ko point karega */
  const url = `${SITE_URL}/eyeglasses/${getSlug(product)}`;

  return {
    title,
    description: `Shop ${name} by ${brand} at LensMartIndia${
      price > 0 ? ` for ₹${price.toLocaleString("en-IN")}` : ""
    }. Explore stylish eyeglasses and order online.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: `Explore ${name} by ${brand} at LensMartIndia.`,
      url,
      type: "website",
    },
  };
}

export default function EyeglassesProductLayout({ children }) {
  return children;
}