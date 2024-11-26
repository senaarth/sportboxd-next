/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yeon.s3.amazonaws.com",
      },
    ],
  },
  reactStrictMode: false,
  webpack: (config) => {
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  },
};

module.exports = nextConfig;
