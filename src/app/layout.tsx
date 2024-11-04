import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import localFont from "next/font/local";

// Font files can be colocated inside of `app`
const myFont = localFont({
  src: "./fonts/D-DIN.otf",
  display: "swap",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Korkeasaari",
    default: "Korkeasaari",
  },
  description: "Zoolytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider attribute="class">
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow m-auto max-w-[80em] w-full">{children}</main>
                <footer className="w-full">
                    <Footer />
                </footer>
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}
