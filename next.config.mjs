/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/trustwallet/assets/master/blockchains/ethereum/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'static.debank.com',
        pathname: '/image/bsc_token/logo_url/**',
      },
    ],
  },
};

export default nextConfig;
