import Link from "next/link";
import "../styles/productNotFound.css";

const CATEGORIES = {
  eyeglasses: { name: "Eyeglasses", base: "/eyeglasses" },
  sunglasses: { name: "Sunglasses", base: "/sunglasses" },
};

export default function ProductNotFound({ category }) {
  const { name, base } = CATEGORIES[category] ?? {
    name: "Products",
    base: "/",
  };

  return (
    <div className="sundetail-not-found">
      <h1>Product Not Found</h1>
      <p>This {name.toLowerCase()} product is not available.</p>
      <Link href={base}>Back to {name}</Link>
    </div>
  );
}