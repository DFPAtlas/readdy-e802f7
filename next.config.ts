import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return ['admin', 'portal', 'staff', 'uat', 'pbx', 'account', 'auth', 'email', 'api'].map((area) => ({
      source: `/${area}/:path*`,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }));
  },
  staticPageGenerationTimeout: 120,
  experimental: {
    staticGenerationMaxConcurrency: 4,
    staticGenerationMinPagesPerWorker: 16,
  },
};

export default nextConfig;
