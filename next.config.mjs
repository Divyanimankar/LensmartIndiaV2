// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/all-products",
        destination: "/collections/contact-lenses",
        permanent: true, // 301 redirect
      },
      {
        /* purana /eyeglasses -> naya /collections/eyeglasses
           (testing ke liye false; live jaane se pehle true kar dena) */
        source: "/eyeglasses",
        destination: "/collections/eyeglasses",
        permanent: false,
      },
      {
        source: "/sunglasses",
        destination: "/collections/sunglasses",
        permanent: false,
      },
      {
        source: "/contact-lenses",
        destination: "/collections/contact-lenses",
        permanent: false,
      },
      {
        source: "/sunglasses/category/women",
        destination: "/collections/women-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/category/men",
        destination: "/collections/men-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/category/kids",
        destination: "/collections/kids-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/category/unisex",
        destination: "/collections/unisex-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/category/new-arrivals",
        destination: "/collections/new-arrivals-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/category/bestsellers",
        destination: "/collections/bestsellers-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/shape/square",
        destination: "/collections/square-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/shape/rectangle",
        destination: "/collections/rectangle-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/shape/round",
        destination: "/collections/round-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/shape/oval",
        destination: "/collections/oval-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/shape/cat-eye",
        destination: "/collections/cat-eye-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/shape/geometric",
        destination: "/collections/geometric-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/shape/aviator",
        destination: "/collections/aviator-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/brand/idee",
        destination: "/collections/idee-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/brand/idee-young",
        destination: "/collections/idee-young-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/brand/irus",
        destination: "/collections/irus-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/brand/police",
        destination: "/collections/police-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/brand/fila",
        destination: "/collections/fila-sunglasses",
        permanent: false,
      },
      {
        source: "/sunglasses/brand/guess",
        destination: "/collections/guess-sunglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/category/women",
        destination: "/collections/women-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/category/men",
        destination: "/collections/men-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/category/kids",
        destination: "/collections/kids-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/category/unisex",
        destination: "/collections/unisex-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/category/new-arrivals",
        destination: "/collections/new-arrivals-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/category/bestsellers",
        destination: "/collections/bestsellers-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/shape/square",
        destination: "/collections/square-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/shape/rectangle",
        destination: "/collections/rectangle-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/shape/round",
        destination: "/collections/round-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/shape/oval",
        destination: "/collections/oval-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/shape/cat-eye",
        destination: "/collections/cat-eye-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/shape/butterfly",
        destination: "/collections/butterfly-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/brand/idee",
        destination: "/collections/idee-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/brand/irus",
        destination: "/collections/irus-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/brand/fila",
        destination: "/collections/fila-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/brand/guess",
        destination: "/collections/guess-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/brand/ana-hickmann",
        destination: "/collections/ana-hickmann-eyeglasses",
        permanent: false,
      },
      {
        source: "/eyeglasses/brand/furla",
        destination: "/collections/furla-eyeglasses",
        permanent: false,
      },
      {
        source: "/collections/womens-sunglasses",
        destination: "/collections/women-sunglasses",
        permanent: false,
      },
      {
        source: "/collections/mens-sunglasses",
        destination: "/collections/men-sunglasses",
        permanent: false,
      },
      {
        source: "/collections/womens-eyeglasses",
        destination: "/collections/women-eyeglasses",
        permanent: false,
      },
      {
        source: "/collections/mens-eyeglasses",
        destination: "/collections/men-eyeglasses",
        permanent: false,
      },
      {
        source: "/manufacturer/:slug",
        destination: "/collections/:slug",
        permanent: false,
      },
      {
        source: "/brands/:slug",
        destination: "/collections/:slug",
        permanent: false,
      },
      {
        source: "/lens-type/daily",
        destination: "/collections/daily-disposable-contact-lenses",
        permanent: false,
      },
      {
        source: "/lens-type/weekly",
        destination: "/collections/weekly-disposable-contact-lenses",
        permanent: false,
      },
      {
        source: "/lens-type/monthly",
        destination: "/collections/monthly-disposable-contact-lenses",
        permanent: false,
      },
      {
        source: "/lens-type/multifocal",
        destination: "/collections/multifocal-contact-lenses",
        permanent: false,
      },
      {
        source: "/lens-type/toric",
        destination: "/collections/toric-contact-lenses",
        permanent: false,
      },
      {
        source: "/lens-type/color",
        destination: "/collections/color-contact-lenses",
        permanent: false,
      },
    ];
  },

  async rewrites() {
    const afterFiles = [
      {
        /* /collections/eyeglasses par wahi purana eyeglasses page dikhega */
        source: "/collections/eyeglasses",
        destination: "/eyeglasses",
      },
      {
        source: "/collections/sunglasses",
        destination: "/sunglasses",
      },
      {
        source: "/collections/contact-lenses",
        destination: "/contact-lenses",
      },
      {
        source: "/collections/daily-disposable-contact-lenses",
        destination: "/lens-type/daily",
      },
      {
        source: "/collections/weekly-disposable-contact-lenses",
        destination: "/lens-type/weekly",
      },
      {
        source: "/collections/monthly-disposable-contact-lenses",
        destination: "/lens-type/monthly",
      },
      {
        source: "/collections/multifocal-contact-lenses",
        destination: "/lens-type/multifocal",
      },
      {
        source: "/collections/toric-contact-lenses",
        destination: "/lens-type/toric",
      },
      {
        source: "/collections/color-contact-lenses",
        destination: "/lens-type/color",
      },
      {
        source: "/collections/women-sunglasses",
        destination: "/sunglasses/category/women",
      },
      {
        source: "/collections/men-sunglasses",
        destination: "/sunglasses/category/men",
      },
      {
        source: "/collections/kids-sunglasses",
        destination: "/sunglasses/category/kids",
      },
      {
        source: "/collections/unisex-sunglasses",
        destination: "/sunglasses/category/unisex",
      },
      {
        source: "/collections/new-arrivals-sunglasses",
        destination: "/sunglasses/category/new-arrivals",
      },
      {
        source: "/collections/bestsellers-sunglasses",
        destination: "/sunglasses/category/bestsellers",
      },
      {
        source: "/collections/square-sunglasses",
        destination: "/sunglasses/shape/square",
      },
      {
        source: "/collections/rectangle-sunglasses",
        destination: "/sunglasses/shape/rectangle",
      },
      {
        source: "/collections/round-sunglasses",
        destination: "/sunglasses/shape/round",
      },
      {
        source: "/collections/oval-sunglasses",
        destination: "/sunglasses/shape/oval",
      },
      {
        source: "/collections/cat-eye-sunglasses",
        destination: "/sunglasses/shape/cat-eye",
      },
      {
        source: "/collections/geometric-sunglasses",
        destination: "/sunglasses/shape/geometric",
      },
      {
        source: "/collections/aviator-sunglasses",
        destination: "/sunglasses/shape/aviator",
      },
      {
        source: "/collections/idee-sunglasses",
        destination: "/sunglasses/brand/idee",
      },
      {
        source: "/collections/idee-young-sunglasses",
        destination: "/sunglasses/brand/idee-young",
      },
      {
        source: "/collections/irus-sunglasses",
        destination: "/sunglasses/brand/irus",
      },
      {
        source: "/collections/police-sunglasses",
        destination: "/sunglasses/brand/police",
      },
      {
        source: "/collections/fila-sunglasses",
        destination: "/sunglasses/brand/fila",
      },
      {
        source: "/collections/guess-sunglasses",
        destination: "/sunglasses/brand/guess",
      },
      {
        source: "/collections/women-eyeglasses",
        destination: "/eyeglasses/category/women",
      },
      {
        source: "/collections/men-eyeglasses",
        destination: "/eyeglasses/category/men",
      },
      {
        source: "/collections/kids-eyeglasses",
        destination: "/eyeglasses/category/kids",
      },
      {
        source: "/collections/unisex-eyeglasses",
        destination: "/eyeglasses/category/unisex",
      },
      {
        source: "/collections/new-arrivals-eyeglasses",
        destination: "/eyeglasses/category/new-arrivals",
      },
      {
        source: "/collections/bestsellers-eyeglasses",
        destination: "/eyeglasses/category/bestsellers",
      },
      {
        source: "/collections/square-eyeglasses",
        destination: "/eyeglasses/shape/square",
      },
      {
        source: "/collections/rectangle-eyeglasses",
        destination: "/eyeglasses/shape/rectangle",
      },
      {
        source: "/collections/round-eyeglasses",
        destination: "/eyeglasses/shape/round",
      },
      {
        source: "/collections/oval-eyeglasses",
        destination: "/eyeglasses/shape/oval",
      },
      {
        source: "/collections/cat-eye-eyeglasses",
        destination: "/eyeglasses/shape/cat-eye",
      },
      {
        source: "/collections/butterfly-eyeglasses",
        destination: "/eyeglasses/shape/butterfly",
      },
      {
        source: "/collections/idee-eyeglasses",
        destination: "/eyeglasses/brand/idee",
      },
      {
        source: "/collections/irus-eyeglasses",
        destination: "/eyeglasses/brand/irus",
      },
      {
        source: "/collections/fila-eyeglasses",
        destination: "/eyeglasses/brand/fila",
      },
      {
        source: "/collections/guess-eyeglasses",
        destination: "/eyeglasses/brand/guess",
      },
      {
        source: "/collections/ana-hickmann-eyeglasses",
        destination: "/eyeglasses/brand/ana-hickmann",
      },
      {
        source: "/collections/furla-eyeglasses",
        destination: "/eyeglasses/brand/furla",
      },
    ];

    return afterFiles;
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