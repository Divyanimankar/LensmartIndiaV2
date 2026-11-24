// lib/pageContentBlocks.js
//
// Fetches the metaobjects stored in a Page metafield (list of metaobject
// references) from the Shopify Storefront API and turns them into a simple
// { [blockId]: { eyebrow, heading, ... } } map.
//
// ENV (.env.local):
//   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
//   SHOPIFY_STOREFRONT_TOKEN=xxxxxxxxxxxxxxxx
//   SHOPIFY_API_VERSION=2025-01            (optional)

import { cache } from "react";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-01";

// Namespace + key of the *Page metafield* that holds the content blocks.
// Check it in Settings → Custom data → Pages → "Content Blocks".
export const BLOCKS_NAMESPACE = "custom";
export const BLOCKS_KEY = "content_blocks";

const EMPTY = { blocks: {}, seo: null };

const QUERY = /* GraphQL */ `
  query PageContentBlocks($handle: String!, $namespace: String!, $key: String!) {
    page(handle: $handle) {
      id
      title
      seo {
        title
        description
      }
      metafield(namespace: $namespace, key: $key) {
        references(first: 20) {
          nodes {
            ... on Metaobject {
              handle
              type
              fields {
                key
                type
                value
                references(first: 20) {
                  nodes {
                    ... on Metaobject {
                      handle
                      type
                      fields {
                        key
                        type
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Metaobject "list of single line text" fields come back as a JSON string
// e.g. '["One","Two"]'. Fall back to newline-splitting for plain text.
function parseList(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    /* not JSON */
  }
  return String(value)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Turn the raw fields into a friendly object.
// Fields are matched by KEY (exact first, then "starts with"), so
// "block_id" also matches "block_id_do_not_change".
const slug = (str) =>
  String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

function normalizeBlock(node) {
  const entries = node.fields.map((field) => ({
    key: slug(field.key),
    value: field.value,
  }));

  const pick = (name) => {
    const exact = entries.find((e) => e.key === name);
    if (exact) return exact.value;
    const loose = entries.find((e) => e.key.startsWith(name));
    return loose ? loose.value : undefined;
  };

  // Find a field by a pattern on its key (used for button text / url, whose
  // exact keys aren't known until they have been filled in once).
  const find = (regex) => entries.find((e) => regex.test(e.key))?.value;

  // "Repeating items" = a list of other Page Content Blocks (e.g. steps, FAQs).
  // We find that field by its content, so its key name doesn't matter.
  const childField = node.fields.find((f) => f.references?.nodes?.length);
  const children = childField
    ? childField.references.nodes.filter((n) => n?.fields).map(normalizeBlock)
    : [];

  // Keys of the "Page Content Block" definition:
  //   block_id, eyebrow, title, accent, text, items (list), note, ...
  // Empty fields are not returned by Shopify at all, hence the fallbacks.
  return {
    // The metaobject handle is similar ("how-to-step-1"), a safe fallback
    id: pick("block_id") || node.handle,
    eyebrow: pick("eyebrow") || "",
    heading: pick("title") || "",
    highlight: pick("accent") || "",
    body: pick("text") || "",
    note: pick("note") || pick("small_note") || "",
    list: parseList(pick("items")),
    buttonText:
      find(/(button|btn|cta|link).*(text|label)|(text|label).*(button|btn|cta|link)/) || "",
    buttonUrl: find(/(button|btn|cta|link).*(url|href)|^(url|href)$/) || "",
    children,
  };
}

async function fetchPageUncached(pageHandle) {
  const tag = "[pageContentBlocks]";

  if (!DOMAIN || !TOKEN) {
    console.error(
      `${tag} Missing env vars. SHOPIFY_STORE_DOMAIN=${DOMAIN ? "set" : "MISSING"}, ` +
        `SHOPIFY_STOREFRONT_TOKEN=${TOKEN ? "set" : "MISSING"}. ` +
        `Add them to .env.local and RESTART the dev server.`
    );
    return EMPTY;
  }

  // A private (server-side) token uses a different header than a public one.
  const authHeader = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
    ? { "Shopify-Storefront-Private-Token": process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN }
    : { "X-Shopify-Storefront-Access-Token": TOKEN };

  const url = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          handle: pageHandle,
          namespace: BLOCKS_NAMESPACE,
          key: BLOCKS_KEY,
        },
      }),
      // While debugging, always hit Shopify. Switch back to ISR once it works:
      //   next: { revalidate: 300, tags: [`page-${pageHandle}`] }
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(
        `${tag} HTTP ${res.status} from ${url}. ` +
          (res.status === 401 || res.status === 403
            ? "The Storefront token is invalid or lacks access."
            : res.status === 404
            ? "Check SHOPIFY_STORE_DOMAIN – it must be the *.myshopify.com domain."
            : "")
      );
      return EMPTY;
    }

    const json = await res.json();

    if (json.errors) {
      console.error(`${tag} GraphQL errors:`, JSON.stringify(json.errors, null, 2));
      return EMPTY;
    }

    const page = json?.data?.page;
    if (!page) {
      console.error(
        `${tag} No page found for handle "${pageHandle}". Either the handle is wrong, ` +
          `the page is hidden, or the token is missing the "unauthenticated_read_content" scope.`
      );
      return EMPTY;
    }

    const mf = page.metafield;
    if (!mf) {
      console.error(
        `${tag} Page "${pageHandle}" found, but metafield ${BLOCKS_NAMESPACE}.${BLOCKS_KEY} is null. ` +
          `Fix: Settings > Custom data > Pages > Content Blocks > Access > enable "Storefront". ` +
          `Also make sure blocks are actually attached to this page.`
      );
      return { blocks: {}, seo: page.seo ?? null };
    }

    const nodes = mf.references?.nodes ?? [];
    const valid = nodes.filter((n) => n && n.fields);

    if (valid.length === 0) {
      console.error(
        `${tag} Metafield found but returned ${nodes.length} usable metaobjects. Fix: ` +
          `(1) Settings > Custom data > Metaobjects > Page Content Block > Access > enable "Storefront"; ` +
          `(2) make sure each entry's status is Active, not Draft; ` +
          `(3) token needs the "unauthenticated_read_metaobjects" scope.`
      );
      return { blocks: {}, seo: page.seo ?? null };
    }

    const blocks = valid.reduce((acc, node) => {
      const block = normalizeBlock(node);
      acc[block.id] = block;

      // Set PAGE_BLOCKS_DEBUG=1 in .env.local to print raw vs. read values
      if (process.env.PAGE_BLOCKS_DEBUG) console.log(
        `${tag} RAW "${node.handle}":`,
        JSON.stringify(node.fields.map((f) => ({ key: f.key, type: f.type, value: f.value })))
      );
      if (process.env.PAGE_BLOCKS_DEBUG) console.log(`${tag} READ "${node.handle}":`, JSON.stringify(block));
      return acc;
    }, {});

    console.log(`${tag} Loaded blocks:`, Object.keys(blocks).join(", "));
    return { blocks, seo: page.seo ?? null };
  } catch (err) {
    console.error(`${tag} Request failed (network/DNS?):`, err);
    return EMPTY;
  }
}

// React cache() means that generateMetadata() and the page component share
// ONE Shopify request per render instead of making two.
const fetchPage = cache(fetchPageUncached);

/** { [blockId]: { eyebrow, heading, highlight, body, list, ... } } */
export async function getPageBlocks(pageHandle) {
  return (await fetchPage(pageHandle)).blocks;
}

/** { title, description } from the Page's "Search engine listing", or null */
export async function getPageSeo(pageHandle) {
  return (await fetchPage(pageHandle)).seo;
}