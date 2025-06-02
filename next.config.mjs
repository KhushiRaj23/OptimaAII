/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            { 
                protocol: "https",
                hostname:"randomuser.me",
            },

        ],
    },
    // Add output configuration for Vercel
    output: 'standalone',
    // Ensure proper handling of environment variables
    env: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    },
    // Add experimental features for better server component handling
    experimental: {
        serverActions: true,
    },
};

export default nextConfig;
