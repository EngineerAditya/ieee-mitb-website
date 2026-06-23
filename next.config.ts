import type { NextConfig } from "next";

/**
 * Next.js configuration.
 *
 * `images.remotePatterns` whitelists the hosts that `next/image` is allowed to
 * optimize. Supabase Storage serves uploaded event/article/society images from
 * `<project-ref>.supabase.co`, so that host must be allowed. We derive it from
 * the public Supabase URL when available and fall back to the wildcard
 * Supabase domain so local/dev builds without env still type-check and build.
 */
const supabaseHost = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost ?? "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    // Admin image uploads are capped at 4 MB (see lib/actions/_shared.ts);
    // keep the action body limit just above that to shrink the abuse surface.
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
