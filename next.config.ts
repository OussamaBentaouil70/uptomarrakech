import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        pathname: "/**",
        port: "",
      },
    ],
  },
  // Export static HTML for Hostinger shared hosting
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
