const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js configurations here
  // For example:
  reactStrictMode: true,
  swcMinify: true,
  // ... other configs
};

module.exports = withPWA(nextConfig);