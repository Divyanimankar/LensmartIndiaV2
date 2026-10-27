import { eyeglassesProducts } from "../../../data/eyeglassesProducts";

const SITE_URL = "https://lensmartindia.com";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const product = eyeglassesProducts.find(
    (item) => String(item.id) === String(id)
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

  return {
    title,
    description: `Shop ${name} by ${brand} at LensMartIndia${
      price > 0 ? ` for ₹${price.toLocaleString("en-IN")}` : ""
    }. Explore stylish eyeglasses and order online.`,
    alternates: {
      canonical: `${SITE_URL}/eyeglasses/${id}`,
    },
    openGraph: {
      title,
      description: `Explore ${name} by ${brand} at LensMartIndia.`,
      url: `${SITE_URL}/eyeglasses/${id}`,
      type: "website",
    },
  };
}

export default function EyeglassesProductLayout({ children }) {
  return children;
}