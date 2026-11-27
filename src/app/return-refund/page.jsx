import RefundClient from "./RefundClient";
import { getRefundPage } from "@/lib/refundPage";

/* Server component: Shopify se content laata hai, UI client file me hai */
export default async function RefundPage() {
  const content = await getRefundPage();

  return <RefundClient content={content} />;
}