/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages deployment
  output: 'export',

  // Note: With custom domain (abdvr.page), no basePath needed
  // basePath is only needed for github.io/repo-name URLs

  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    // Disable Next.js Image Optimization (not supported in static export)
    unoptimized: true,
  },

  // Experimental features for performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['@supabase/supabase-js'],
  },

  // Note: headers() is not supported with 'output: export' (GitHub Pages)
  // Security headers should be configured via GitHub Pages or a CDN if needed
};

export default nextConfig;
