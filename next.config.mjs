/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Remove trailingSlash: true,
  images: {
    unoptimized: true // Required for static export
  }
}

export default nextConfig
