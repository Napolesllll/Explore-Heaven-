import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    typedRoutes: false
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'th.bing.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.elcolombiano.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fbog10-1.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.feoh13-1.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fbog11-1.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.feoh1-1.fna.fbcdn.net',
        pathname: '/**',
      },
    ],
    domains: [
      "res.cloudinary.com",
      "i.pravatar.cc",
      "tse3.mm.bing.net",
      "lh3.googleusercontent.com",
      "tse1.mm.bing.net",
      "example.com",
      "scontent.feoh3-1.fna.fbcdn.net",
      "images.unsplash.com",
    ],
  },
  reactStrictMode: true,
};

// Solución para el problema de tipos de next-pwa
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

export default pwaConfig(nextConfig as any);