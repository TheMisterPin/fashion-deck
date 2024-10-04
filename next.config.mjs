/** @type {import('next').NextConfig} */
const nextConfig = {   // Override the default webpack configuration
      images: {
    remotePatterns: [
      {
        hostname: 'i.ibb.co',
      },
    ],
  },
    webpack: (config) => {
        // See https://webpack.js.org/configuration/resolve/#resolvealias
        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
        }
        return config;
    },
}

export default nextConfig;
