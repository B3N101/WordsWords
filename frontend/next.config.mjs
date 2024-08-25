/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 120,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
