import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // En développement, autorise l'ouverture depuis un téléphone du même réseau local
  // (http://192.168.x.x:3000). Sans effet sur le site en production.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "169.254.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
