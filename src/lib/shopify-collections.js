// import { cache } from "react";
// import { storefront } from "./shopify-storefront";

// const QUERY = `
// query Collection($handle: String!) {
//   collection(handle: $handle) {
//     id
//     handle
//     title
//     description
//     descriptionHtml
//   }
// }`;

// export const getCollection = cache(async (handle) => {
//   if (!handle) return null;
//   const data = await storefront(QUERY, { handle });
//   return data.collection || null;
// });

import { cache } from "react";
import { storefront } from "./shopify-storefront";
import { getHandleCandidates } from "@/data/collectionHandles";

const QUERY = `
  query Collection($handle: String!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      seo {
        title
        description
      }
      faqsField: metafield(namespace: "custom", key: "faqs") {
        value
      }
    }
  }
`;

function parseFaqs(raw) {
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.filter((f) => f && f.q && f.a);
  } catch {
    return [];
  }
}

export const getCollection = cache(async (handle) => {
  if (!handle) return null;

  try {
    const data = await storefront(QUERY, { handle });
    const collection = data?.collection;

    if (!collection) return null;

    return {
      ...collection,
      faqs: parseFaqs(collection.faqsField?.value),
    };
  } catch (error) {
    console.error("getCollection failed:", handle, error);
    return null;
  }
});

/* page type + slug se sahi Shopify collection dhoondhta hai */
export const getCollectionFor = cache(async (type, slug) => {
  for (const handle of getHandleCandidates(type, slug)) {
    const found = await getCollection(handle);
    if (found) return found;
  }
  return null;
});