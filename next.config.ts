import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const productionSecurityHeaders = isProduction
  ? [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ]
  : [];

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // External volumes (/Volumes/*) can break webpack pack renames → missing manifests.
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  async headers() {
    return [
      ...(isProduction
        ? [
            {
              source: "/:path*",
              headers: productionSecurityHeaders,
            },
          ]
        : []),
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
