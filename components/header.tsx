import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-center">
        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="text-gray-700 hover:text-green transition font-medium"
          >
            Blogi
          </Link>
        </div>
      </nav>
    </header>
  );
}
