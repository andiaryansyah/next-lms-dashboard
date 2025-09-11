/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.pexels.com",
      },
      {
        hostname: "png.pngtree.com",
      },
      {
        hostname: "marketplace.canva.com",
      },
    ],
  },
};

export default nextConfig;
