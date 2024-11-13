/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/landingpage',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
