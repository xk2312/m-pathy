// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      unoptimized: true, // Optional: Wenn du keine Image-Optimierung brauchst
    },
    experimental: {
      appDir: true, // Wichtig für App Router
    },
  }
  
  module.exports = nextConfig
  const path = require('path')

module.exports = {
  webpack: (config) => {
    config.resolve.alias['@modules'] = path.resolve(__dirname, 'app/modules')
    config.resolve.alias['@components'] = path.resolve(__dirname, 'app/components')
    config.resolve.alias['@styles'] = path.resolve(__dirname, 'styles')
    // weitere Aliase hier bei Bedarf

    return config
  }
}
