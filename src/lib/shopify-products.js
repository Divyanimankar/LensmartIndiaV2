import { cache } from "react";
import { storefront } from "./shopify-storefront";
import { mapProduct, mapSunglass, mapSunglassDetail } from "./shopify-map";

/* Where the prescription JSON lives. Default: custom.prescription_details
   Different name?  Set  SHOPIFY_RX_METAFIELD=namespace.key  in .env.local */
const RX_IDS = [
  process.env.SHOPIFY_RX_METAFIELD,
  "custom.lens_prescription",
  "custom.prescription_details",
  "custom.prescriptionDetails",
  "custom.prescription",
]
  .filter(Boolean)
  .map((id) => {
    const [namespace, key] = id.split(".");
    return `{ namespace: "${namespace}", key: "${key}" }`;
  })
  .join(", ");

const QUERY = `
query Products($after: String) {
  products(first: 100, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id
      handle
      title
      vendor
      productType
      tags
      description
      availableForSale
      variants(first: 1) { nodes { id availableForSale } }
      featuredImage { url altText }
      images(first: 6) { nodes { url altText } }
      priceRange { minVariantPrice { amount currencyCode } }
      compareAtPriceRange { minVariantPrice { amount currencyCode } }
      metafields(identifiers: [${RX_IDS}]) { namespace key value }
      options { name values }
      collections(first: 10) { nodes { title handle } }
      sunglassesMeta: metafields(identifiers: [
        { namespace: "custom", key: "frame_for" },
        { namespace: "custom", key: "frame_shape" },
        { namespace: "custom", key: "sunglasses_frame_material" }
      ]) { namespace key value }
      filterMeta: metafields(identifiers: [
        { namespace: "custom", key: "shop_by_brand" },
        { namespace: "custom", key: "wear_type" },
        { namespace: "custom", key: "wear_schedule" }
      ]) { namespace key value }
    }
  }
}`;

/* Every product in the store (raw Shopify nodes), fetched once per request. */
const getAllNodes = cache(async () => {
  const nodes = [];
  let after = null;

  for (let page = 0; page < 20; page++) {
    const data = await storefront(QUERY, { after });
    nodes.push(...data.products.nodes);

    if (!data.products.pageInfo.hasNextPage) break;
    after = data.products.pageInfo.endCursor;
  }

  return nodes;
});

/* Product Type set in Shopify ("Sunglasses", "Eyeglasses", ...) */
const isType = (node, pattern) => pattern.test(node.productType || "");
const SUNGLASSES = /sun\s*glass/i;
const EYEGLASSES = /eye\s*glass|spectacle|frame/i;

/* Contact lenses = everything that is NOT sunglasses / eyeglasses. */
export const getContactLensProducts = cache(async () => {
  const nodes = await getAllNodes();

  return nodes
    .filter((n) => !isType(n, SUNGLASSES) && !isType(n, EYEGLASSES))
    .map(mapProduct);
});

/* Raw sunglasses nodes. */
export const getSunglassesNodes = cache(async () => {
  const nodes = await getAllNodes();
  return nodes.filter((n) => isType(n, SUNGLASSES));
});

/* Sunglasses in the same shape as the old sunglassesProducts data. */
export const getSunglassesProducts = cache(async () => {
  const nodes = await getSunglassesNodes();
  return nodes.map(mapSunglass);
});


/* Eyeglasses: same Shopify fields as sunglasses, so the same mappers are used. */
export const getEyeglassesProducts = cache(async () => {
  const nodes = await getAllNodes();
  return nodes.filter((n) => isType(n, EYEGLASSES)).map(mapSunglass);
});

/* ---------- one sunglasses product (details page) ---------- */
const REF = `reference { ... on Metaobject { type handle fields { key type value } } }`;

const DETAIL_QUERY = `
query SunglassDetail($handle: String!) {
  product(handle: $handle) {
    id
    handle
    title
    vendor
    productType
    tags
    description
    descriptionHtml
    availableForSale
    featuredImage { url altText }
    images(first: 12) { nodes { url altText } }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
    options { name values }
    collections(first: 10) { nodes { title handle } }
    variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        price { amount }
        compareAtPrice { amount }
        selectedOptions { name value }
        image { url }
      }
    }
    sunglassesMeta: metafields(identifiers: [
      { namespace: "custom", key: "frame_for" },
      { namespace: "custom", key: "frame_shape" },
      { namespace: "custom", key: "sunglasses_frame_material" }
    ]) { namespace key value }
    glassesDetails: metafield(namespace: "custom", key: "glasses_product_details") { ${REF} }
    careInstructions: metafield(namespace: "custom", key: "care_instructions") { ${REF} }
    lensCompat: metafield(namespace: "custom", key: "lens_compatibility") { ${REF} }
    productFaqs: metafield(namespace: "custom", key: "product_faqs") { value }
  }
}`;

export const getSunglassesDetail = cache(async (handle) => {
  if (!handle) return null;
  const data = await storefront(DETAIL_QUERY, { handle });
  const node = data.product;
  if (!node || !/sun\s*glass/i.test(node.productType || "")) return null;
  return mapSunglassDetail(node);
});

export const getEyeglassesDetail = cache(async (handle) => {
  if (!handle) return null;
  const data = await storefront(DETAIL_QUERY, { handle });
  const node = data.product;
  if (!node || !EYEGLASSES.test(node.productType || "")) return null;
  return mapSunglassDetail(node);
});

/* ---------- contact lens details page: extra fields for ONE product ----------
   details     <- metaobject "Contact Lenses Product Details"
                  (custom.contact_lenses_product_details)
   designedFor <- rich text "Contacts Designed For" (custom.contacts_designed_for)
   faqs        <- custom.product_faqs                                          */
const EXTRAS_QUERY = `
query ContactExtras($handle: String!) {
  product(handle: $handle) {
    contactDetails: metafield(namespace: "custom", key: "contact_lenses_product_details") {
      reference { ... on Metaobject { fields { key value } } }
    }
    designedFor: metafield(namespace: "custom", key: "contacts_designed_for") { value }
    productFaqs: metafield(namespace: "custom", key: "product_faqs") { value }
  }
}`;

export const getContactLensExtras = cache(async (handle) => {
  if (!handle) return {};

  const data = await storefront(EXTRAS_QUERY, { handle });
  const node = data.product;
  if (!node) return {};

  const details = Object.fromEntries(
    (node.contactDetails?.reference?.fields || []).map((f) => [f.key, f.value]),
  );

  let faqs = [];
  try {
    const parsed = JSON.parse(node.productFaqs?.value || "[]");
    if (Array.isArray(parsed)) faqs = parsed.filter((f) => f && f.question && f.answer);
  } catch {}

  return {
    details,
    designedFor: node.designedFor?.value || "",
    faqs,
  };
});