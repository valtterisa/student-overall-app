import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [{ label: "Blogi", href: "/blog" }];

const dropdownLinks = [
  { label: "Kaikki värit", href: "/vari" },
  { label: "Kaikki alat", href: "/ala" },
  { label: "Kaikki oppilaitokset", href: "/oppilaitos" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-white/90 backdrop-blur">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-xl font-semibold text-green tracking-tight"
        >
          Haalarikone
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 rounded-full border border-transparent px-3 py-1.5 transition-colors hover:border-green hover:text-green focus:outline-none focus:ring-2 focus:ring-green/40">
                Linkit
                <span aria-hidden="true">▾</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {dropdownLinks.map((link) => (
                <DropdownMenuItem key={`pikalinkit-${link.href}`} asChild>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-green"
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-green transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
