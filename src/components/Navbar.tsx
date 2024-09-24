import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import zoolytics from "@/assets/zoolytics.png";

export default function Navbar() {
  return (
    <header className="sticky top-0 bg-secondary dark:bg-slate-800 z-10">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-3 py-4">
        <Image alt="asd" src={zoolytics} height={50}></Image>
        <nav className="space-x-4 flex items-center gap-8 font-medium text-base">
          <Link href="/">Dashboard</Link>
          <Link href="/analytics">Analytics</Link>
          <Link href="/forecasts">Forecasts</Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}