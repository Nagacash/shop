import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/uploads/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/static/uploads/:path*",
        destination: "/uploads/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/collections/naga-green",
        destination: "/collections/naga-black",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
