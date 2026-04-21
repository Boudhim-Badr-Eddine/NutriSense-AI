/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  compress: true,
  async rewrites() {
    const apiProxyTarget =
      process.env.API_PROXY_TARGET ?? "http://localhost:5000/api";

    return [
      {
        source: "/api/:path*",
        destination: `${apiProxyTarget}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
