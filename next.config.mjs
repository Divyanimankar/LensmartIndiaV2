// /** @type {import('next').NextConfig} */
// const nextConfig = {};
// export default nextConfig;


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
};

export default nextConfig;