
import { allProducts } from "../../../data/allProducts";

const SITE_URL = "https://lensmartindia.com";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const product = allProducts.find(
    (item) => String(item.id) === String(id)
  );

  if (!product) {
    return {
      title: "Product Not Found | LensMartIndia",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const name = product.name || "Contact Lenses";
  const brand = product.brand || product.manufacturer || "LensMartIndia";
  const price = Number(product.price || 0);

  return {
    title: `${name} | Buy Online at LensMartIndia`,
    description: `Shop ${name} by ${brand} at LensMartIndia${
      price > 0 ? ` for ₹${price.toLocaleString("en-IN")}` : ""
    }. Explore product details and order online.`,
    alternates: {
      canonical: `${SITE_URL}/contact-lenses/${id}`,
    },
    openGraph: {
      title: `${name} | LensMartIndia`,
      description: `Explore ${name} by ${brand} at LensMartIndia.`,
      url: `${SITE_URL}/contact-lenses/${id}`,
      type: "website",
    },
  };
}

export default function ContactLensProductLayout({ children }) {
  return children;
}
