/** @type {import('next').NextConfig} */
const nextConfig = {   // Override the default webpack configuration
      images: {
    remotePatterns: [
      {
        hostname: 'i.ibb.co', 
      },
      {
        hostname: 'res.cloudinary.com', 
      },
    ],
  },
}

export default nextConfig;
