import { NextResponse } from "next/server";
import { customerGql } from "@/lib/customer-api";

export const dynamic = "force-dynamic";

/* TEMPORARY debug link: /api/wishlist-debug  (kaam ke baad folder delete kar dena) */
export async function GET() {
  const who = await customerGql(`{ customer { id } }`);
  if (who.error) return NextResponse.json({ step: "customer", error: who.error });
  const id = who.data?.customer?.id;

  const sentinel = JSON.stringify([{ id: 1, name: "debug-test" }]);

  /* 1. likho aur Shopify ka poora jawab dikhao */
  const write = await customerGql(
    `mutation Set($m: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $m) {
        metafields { namespace key type value }
        userErrors { field message code }
      }
    }`,
    { m: [{ ownerId: id, namespace: "custom", key: "wishlist", type: "json", value: sentinel }] },
  );

  /* 2. thoda ruk kar alag-alag tarike se padho */
  await new Promise((r) => setTimeout(r, 2500));

  const read1 = await customerGql(`{
    customer {
      a: metafield(namespace: "custom", key: "wishlist") { namespace key type value }
      b: metafields(identifiers: [{ namespace: "custom", key: "wishlist" }]) { namespace key type value }
    }
  }`);

  /* 3. asli (purani) wishlist wapas */
  const restore = await customerGql(
    `mutation Set($m: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $m) { userErrors { message } }
    }`,
    { m: [{ ownerId: id, namespace: "custom", key: "wishlist", type: "json", value: "[]" }] },
  );

  return NextResponse.json({ write, read1, restoreOk: !restore.error });
}