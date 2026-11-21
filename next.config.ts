import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/:path*', has: [{ type: 'host', value: 'www.digital-footprint.uk' }], destination: 'https://digital-footprint.uk/:path*', permanent: true },
      { source: '/opengraph-image', destination: '/og-image.png', permanent: true },
      { source: '/og-image.jpg', destination: '/og-image.png', permanent: true },
    ];
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return ['admin', 'portal', 'staff', 'uat', 'pbx', 'account', 'auth', 'email', 'api', 'login', 'checkout'].map((area) => ({
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

export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for production builds.');
    }
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL must be an HTTP(S) URL.');
    }
    if (key.startsWith('sb_secret_')) {
      throw new Error('A Supabase secret key must never be used as NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }
    const payload = key.split('.')[1];
    if (payload) {
      const claims: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString());
      if (typeof claims === 'object' && claims !== null && 'role' in claims && claims.role !== 'anon') {
        throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY must have the anon role.');
      }
    }
  }
  return nextConfig;
}
