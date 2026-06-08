/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/contracts', '@repo/types', '@repo/utils'],
};

export default nextConfig;
