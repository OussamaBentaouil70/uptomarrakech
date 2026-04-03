import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uptomarrakech.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: 'http',
        hostname: 'googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uptomarrakech.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'p7.hiclipart.com',
        pathname: '/**',
      },
      {
    protocol: 'https',
    hostname: '**.clipartmax.com', // This covers both clipartmax.com and www.clipartmax.com
    pathname: '/**',
 },
  {
    protocol: 'https',
    hostname: '**.pexels.com',
    pathname: '/**',
 },
    ],
  },
};

export default nextConfig;
