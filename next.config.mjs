/** @type {import('next').NextConfig} */
const nextConfig = {
  // A static site: `next build` writes plain HTML, CSS and JS to out/.
  output: "export",
  // Each page becomes folder/index.html, which static hosts serve without rewrites.
  trailingSlash: true,
  images: { unoptimized: true },
  compiler: { styledComponents: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
