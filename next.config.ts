import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    domains: ["res.cloudinary.com"],
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  trailingSlash: true,
};

export default nextConfig;
