/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
    formats: ["image/webp", "image/avif"],
  },
  swcMinify: true,
  compress: true,
};

module.exports = nextConfig;
