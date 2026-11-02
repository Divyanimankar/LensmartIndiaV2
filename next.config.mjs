// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/all-products",
        destination: "/contact-lenses",
        permanent: true, // 301 redirect
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "idee-eyewear.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "www.iruseyewear.com" },
      { protocol: "https", hostname: "filaeyewear.com" },
      { protocol: "https", hostname: "www.rkumar.in" },
      { protocol: "https", hostname: "images.furla.com" },
      { protocol: "https", hostname: "www.robertocavalli.com" },
      { protocol: "https", hostname: "objects-prod.cdn.chopard.com" },
      { protocol: "https", hostname: "www.plein.com" },
      { protocol: "https", hostname: "moscot.com" },
      { protocol: "https", hostname: "images-static.nykaa.com" },
      { protocol: "https", hostname: "www.smartbuyglasses.co.in" },
      { protocol: "https", hostname: "himalayaoptical.com" },
    ],
  },
};

export default nextConfig;