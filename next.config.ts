import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves this project from /Surprise564, not the domain root.
  output: "export",
  basePath: "/Surprise564",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
