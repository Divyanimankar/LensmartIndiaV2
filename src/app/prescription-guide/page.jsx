import PrescriptionGuideClient from "./PrescriptionGuideClient";
import { getPrescriptionGuide } from "@/lib/prescriptionGuide";

/* Server component: Shopify se content laata hai, UI client file me hai */
export default async function PrescriptionGuidePage() {
  const content = await getPrescriptionGuide();

  return <PrescriptionGuideClient content={content} />;
}