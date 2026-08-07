import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const baseSecurityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const productionSecurityHeaders = [
  ...baseSecurityHeaders,
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "media-src 'self'",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com https://*.stripe.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://www.youtube.com https://www.youtube-nocookie.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Keep private ambient masters available to the stream route on Vercel.
  outputFileTracingIncludes: {
    "/api/ambient/[id]": ["./private/ambient/**/*"],
    "/api/ambient/token": ["./private/ambient/**/*"],
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
      {
        source: "/:path*",
        headers: isProduction ? productionSecurityHeaders : baseSecurityHeaders,
      },
      {
        source: "/uploads/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/api/ambient/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-transform" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
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
      // Old public beat URLs — gone (files moved out of /public)
      {
        source: "/new/:file*.mp3",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
