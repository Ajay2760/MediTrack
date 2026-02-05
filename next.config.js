/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['localhost'],
    },
    async rewrites() {
        return [
            {
                source: '/socket.io/:path*',
                destination: 'http://localhost:3001/socket.io/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
