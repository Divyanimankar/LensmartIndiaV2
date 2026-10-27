import { sunglassesProducts } from "../../../data/sunglassesProducts";

const SITE_URL = "https://lensmartindia.com";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const product = sunglassesProducts.find(
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

  const name = product.name || "Sunglasses";
  const brand = product.brand || product.manufacturer || "LensMartIndia";
  const price = Number(product.price || 0);
  const title = `${name} | Buy Online at LensMartIndia`;

  return {
    title,
    description: `Shop ${name} by ${brand} at LensMartIndia${
      price > 0 ? ` for ₹${price.toLocaleString("en-IN")}` : ""
    }. Explore stylish sunglasses and order online.`,
    alternates: {
      canonical: `${SITE_URL}/sunglasses/${id}`,
    },
    openGraph: {
      title,
      description: `Explore ${name} by ${brand} at LensMartIndia.`,
      url: `${SITE_URL}/sunglasses/${id}`,
      type: "website",
    },
  };
}

export default function SunglassesProductLayout({ children }) {
  return children;
}