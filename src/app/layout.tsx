import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="fi">
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider attribute="class">
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow m-auto max-w-[70em] pb-10 pl-5 pr-5 w-full">{children}</main>
            <footer className="w-full">
              <Footer />
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
