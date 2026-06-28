import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      canvas: './src/lib/canvas-stub.ts',
    },
  },
};

export default nextConfig;
