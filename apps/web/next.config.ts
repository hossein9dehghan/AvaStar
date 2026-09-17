import type { NextConfig } from 'next';
const config: NextConfig = {
  transpilePackages: ['@avastar/ui', '@avastar/config'],
  poweredByHeader: false,
  // A small worker pool keeps local/CI builds predictable.
  experimental: { cpus: 2 },
};
export default config;
