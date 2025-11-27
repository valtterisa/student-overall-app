import { Github, Mail } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { label: "Etusivu", href: "/" },
  { label: "Blogi", href: "/blog" },
  { label: "Värit", href: "/vari/sininen" },
  { label: "Alat", href: "/ala/matematiikka" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/60 bg-white">
      <div className="container mx-auto flex w-full flex-col gap-10 px-4 pt-8 pb-4">
        <div className="flex flex-col w-full text-center md:flex-row md:items-center  md:justify-between md:text-left">
          <div className="mx-auto max-w-xl md:mx-0">
            <p className="text-sm uppercase tracking-[0.3em] text-[#65a30d]">
              Haalarikone
            </p>

            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Inspiraatiota, värejä ja perinteitä opiskelijahaalareihin. Pidä
              kulttuuri helposti löydettävänä.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-muted-foreground md:justify-start">
              <Link
                href="mailto:savonen.emppu@gmail.com"
                aria-label="Lähetä sähköpostia"
                className="transition hover:text-green"
              >
                <Mail className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com/valtterisa/student-overall-app"
                target="_blank"
                rel="noreferrer"
                aria-label="Avaa GitHub"
                className="transition hover:text-green"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="w-auto pt-4 md:pt-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Navigaatio
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-green"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-center border-t border-border/60 pt-4 text-center text-xs text-muted-foreground md:flex-row md:items-center ">
          <p>
            Built by{" "}
            <Link
              href="https://valtterisavonen.fi"
              target="_blank"
              className="font-semibold transition hover:text-green"
            >
              @valtterisa
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
