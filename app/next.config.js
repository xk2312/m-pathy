// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true }, // okay für jetzt
  webpack: (config) => {
    config.resolve.alias['@modules'] = path.resolve(__dirname, 'app/modules');
    config.resolve.alias['@components'] = path.resolve(__dirname, 'app/components');
    config.resolve.alias['@styles']   = path.resolve(__dirname, 'styles');
    return config;
  },
  // WICHTIG: kein "output: 'export'" hier – wir laufen als Node/SSR
};

module.exports = nextConfig;
