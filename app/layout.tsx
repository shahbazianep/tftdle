import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
    title: "TFTdle",
    description:
        "TFTdle is a daily Teamfight Tactics guessing game where you try to identify the hidden champion based on traits, cost, and other attributes. Test your knowledge and improve your strategy with every guess!",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <meta
                name="google-site-verification"
                content="mXY5fJAYywFwCTpIudMg1eWLUthRqnKDCaROceJO-sY"
            />
            <body>
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
