// Client-safe helpers (no env / server code).
// Shopify CDN resizes on the fly with ?width=
export function shopifyImage(url, width) {
  if (!url) return "";
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(width));
    return u.toString();
  } catch {
    return url;
  }
}

export function imageSrcSet(url, widths = [480, 800, 1200]) {
  if (!url) return undefined;
  return widths.map((w) => `${shopifyImage(url, w)} ${w}w`).join(", ");
}
