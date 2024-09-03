import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <nav className="mx-auto flex justify-center gap-3 p-3 bg-secondary">
        <Link href="/privacy">Metsämurmelit</Link>
      </nav>
    </footer>
  );
}