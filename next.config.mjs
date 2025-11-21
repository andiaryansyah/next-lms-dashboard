/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // {
      //   hostname: "images.pexels.com",
      // },
      // {
      //   hostname: "png.pngtree.com",
      // },
      // {
      //   hostname: "marketplace.canva.com",
      // },
      // {
      //   hostname: "res.cloudinary.com",
      // },
      {
        hostname: "**",
      },
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;
