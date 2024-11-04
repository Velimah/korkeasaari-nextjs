import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <nav className="mx-auto flex justify-center gap-3 p-3 bg-secondary">
        <Link className="text-lg font-semibold" href="/">Metsämurmelit</Link>
      </nav>
    </footer>
  );
}
