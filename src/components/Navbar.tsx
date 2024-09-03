import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 bg-secondary z-10">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-3 py-4">
        <nav className="space-x-4 font-medium">
          <Link href="/">home</Link>
          <Link href="/about">link 1</Link>
          <Link href="/social">link 2</Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}