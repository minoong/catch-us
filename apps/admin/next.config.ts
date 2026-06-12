import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/auth", "@repo/core", "@repo/db"]
};

export default nextConfig;
