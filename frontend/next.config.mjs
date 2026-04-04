/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
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
  // [DISABLED] 发布页面路由 - 临时屏蔽
  async redirects() {
    return [
      {
        source: '/publish',
        destination: '/knowledge',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;

