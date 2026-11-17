import { storefront } from "@/lib/shopify-storefront";

export const dynamic = "force-dynamic";

const QUERY = `
{
  collections(first: 250) {
    nodes { handle title }
  }
}`;

export default async function Page() {
  const data = await storefront(QUERY);
  const list = data?.collections?.nodes || [];
  return (
    <main style={{ padding: 24, fontFamily: "monospace" }}>
      <h1>{list.length} collections</h1>
      <pre>{list.map((c) => `${c.handle}   |   ${c.title}`).join("\n")}</pre>
    </main>
  );
}