import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(process.cwd()),
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000
  }
};

if (process.env.NEXT_OUTPUT_STANDALONE === "1") {
  nextConfig.output = "standalone";
}

export default nextConfig;
