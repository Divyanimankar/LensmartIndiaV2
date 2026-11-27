import ShippingDeliveryClient from "./ShippingDeliveryClient";
import { getShippingDelivery } from "@/lib/shippingDelivery";

/* Server component: Shopify se content laata hai, UI client file me hai */
export default async function ShippingDeliveryPage() {
  const content = await getShippingDelivery();

  return <ShippingDeliveryClient content={content} />;
}