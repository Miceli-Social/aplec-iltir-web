import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/iltir/aplec-2026/photos/**",
        search: "",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/api/aplec-2026/ticket": ["./src/assets/fonts/LiberationSans-Regular.ttf"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
