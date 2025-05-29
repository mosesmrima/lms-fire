/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    // Optional: define root or aliases if needed
    // root: path.join(__dirname, '..'), // only if using monorepo or unusual structure
    resolveAlias: {
      // Add aliases here if you had any in webpack
    },
    // Optional: extend file resolution
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
};

export default nextConfig;
