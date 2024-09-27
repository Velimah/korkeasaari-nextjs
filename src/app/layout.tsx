import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import localFont from 'next/font/local'

// Font files can be colocated inside of `app`
const myFont = localFont({
  src: './fonts/D-DIN.otf',
  display: 'swap',
})

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
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <Navbar />
          <main className="mx-auto max-w-6xl pb-6 pt-0">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}