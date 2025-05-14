import type { NextConfig } from "next";

/**
 * Allow next/image to optimise Cloudinary and Shields.io URLs.
 * NOTE – Change `demo-cloud` to your actual cloud name
 * (reading from env is supported in Next 15).
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`,
      },
      {
        protocol: "https",
        hostname: "img.shields.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
