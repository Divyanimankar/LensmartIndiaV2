import { storefront } from "@/lib/shopify-storefront";
import { getContactLensProducts } from "@/lib/shopify-products";

export const dynamic = "force-dynamic";

/* LOCAL TEST ONLY - live karne se pehle shopify-test folder delete karna */

const HANDLE = "acuvue-vita-6-pack";

const CANDIDATES = [
  "prescription_details", "prescriptionDetails", "prescriptiondetails",
  "prescription", "prescription_data", "prescription_json",
  "lens_prescription", "rx", "rx_details", "details",
];

const query = `
query Debug($handle: String!) {
  product(handle: $handle) {
    title
    metafields(identifiers: [
      ${CANDIDATES.map((k) => `{ namespace: "custom", key: "${k}" }`).join(",\n      ")}
    ]) { namespace key value }
  }
}`;

export default async function DebugPage() {
  let out = {};

  try {
    const data = await storefront(query, { handle: HANDLE });
    out.productFound = Boolean(data.product);
    out.title = data.product?.title;
    out.metafieldsFound = (data.product?.metafields || [])
      .filter(Boolean)
      .map((m) => ({ key: `${m.namespace}.${m.key}`, valuePreview: String(m.value).slice(0, 120) }));
  } catch (e) {
    out.error = String(e.message || e);
  }

  try {
    const all = await getContactLensProducts();
    const first = all.find((p) => p.handle === HANDLE) || all[0];
    out.totalProducts = all.length;
    out.checkedProduct = first?.handle;
    out.rxParsed = first?.rx ? "YES" : "NO (rx null)";
    out.rxBc = first?.rx?.bc;
    out.rxPlusCount = first?.rx?.powers?.plus?.length;
    out.rxMinusCount = first?.rx?.powers?.minus?.length;
  } catch (e) {
    out.listError = String(e.message || e);
  }

  return (
    <main style={{ padding: 24, fontFamily: "monospace" }}>
      <h1>Shopify debug</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(out, null, 2)}</pre>
    </main>
  );
}