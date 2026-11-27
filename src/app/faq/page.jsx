import FaqClient from "./FaqClient";
import { getFaqPage } from "@/lib/faqPage";

/* Server component: Shopify se content laata hai, UI client file me hai */
export default async function FaqPage() {
  const content = await getFaqPage();

  return <FaqClient content={content} />;
}