import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@guild-optimized/ui",
    "@guild-optimized/db",
    "@guild-optimized/shared",
  ],
};

export default nextConfig;
