import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.lolchess.gg",
            },
            {
                protocol: "https",
                hostname: "ddragon.leagueoflegends.com",
            },
        ],
    },
};

export default nextConfig;
