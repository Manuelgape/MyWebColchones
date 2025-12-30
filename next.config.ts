import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@prisma/engines'],
  webpack: (config) => {
    config.externals.push({
      '@prisma/client': 'commonjs @prisma/client',
    });
    return config;
  },
};

export default nextConfig;
