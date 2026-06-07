import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // In Vercel environments, routing is handled natively by vercel.json.
    // We skip Next.js middleware rewrites to avoid routing loops and proxy overhead.
    if (process.env.VERCEL) {
      return [];
    }
    return [
      {
        source: "/_/backend/:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
