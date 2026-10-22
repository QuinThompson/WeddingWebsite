import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow ngrok (and similar tunnels) to load /_next assets in `next dev`,
  // otherwise client navigations like passport → /invite fail.
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "*.ngrok.io",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
