import { redirect } from "next/navigation";

/* Purana URL /sunglasses/<handle>  ->  naya URL /products/<handle>
   (testing ke baad live jaane se pehle redirect ko permanentRedirect kar dena) */
export default async function SunglassesProductRedirect({ params }) {
  const { slug } = await params;
  redirect(`/products/${slug}`);
}
