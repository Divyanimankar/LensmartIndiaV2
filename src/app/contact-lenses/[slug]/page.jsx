import { redirect } from "next/navigation";

/* Purana URL /contact-lenses/<handle>  ->  naya URL /products/<handle>
   (testing ke baad live jaane se pehle redirect ko permanentRedirect kar dena) */
export default async function ContactLensProductRedirect({ params }) {
  const { slug } = await params;
  redirect(`/products/${slug}`);
}
