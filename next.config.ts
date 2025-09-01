import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://localhost:3000"], // Top-level
  reactStrictMode: true,
  optimizeFonts: false,
  outputFileTracingRoot: __dirname, // // Top-level
};

export default nextConfig;
