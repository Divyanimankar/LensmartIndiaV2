import { redirect } from "next/navigation";

/* Purana URL /eyeglasses/<handle>  ->  naya URL /products/<handle>
   (testing ke baad live jaane se pehle redirect ko permanentRedirect kar dena) */
export default async function EyeglassesProductRedirect({ params }) {
  const { slug } = await params;
  redirect(`/products/${slug}`);
}
