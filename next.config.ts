import type { NextConfig } from "next";

const isExport = process.env.EXPORT_STATIC === "true";

const nextConfig: NextConfig = {
  images: {
    unoptimized: isExport,
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
  // Use: EXPORT_STATIC=true npm run build
  // For Vercel: no environment variable needed (uses Node.js runtime)
  ...(isExport && { output: "export", trailingSlash: true }),
};

export default nextConfig;
