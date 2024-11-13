"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { usePathname } from "next/navigation"; // Import usePathname hook
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get the current path

  // Conditionally set width based on the current path
  const mainClassName =
      pathname === "/homepage" || pathname === "/landingpage" ? "max-w-[90em]" : "max-w-[70em]";

  return (
      <html lang="fi">
      <body className={`${inter.className} min-h-screen`}>
      <ThemeProvider attribute="class">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className={`flex-grow m-auto pb-10 pl-5 pr-5 w-full ${mainClassName}`}>
            {children}
          </main>
          <footer className="w-full">
            <Footer />
          </footer>
        </div>
      </ThemeProvider>
      </body>
      </html>
  );
}
