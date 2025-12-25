"use client";

import { Github, Mail } from "lucide-react";
import { Link } from "@/i18n/routing";
import Logo from "@/components/logo";
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="w-full border-t border-border/60 bg-white">
      <div className="container mx-auto flex w-full flex-col gap-10 px-4 pt-8 pb-4">
        <div className="flex flex-col w-full text-center md:flex-row md:items-center  md:justify-between md:text-left">
          <div className="mx-auto max-w-xl md:mx-0">
            <Logo />

            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              {t('description')}
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-muted-foreground md:justify-start">
              <Link
                href="mailto:savonen.emppu@gmail.com"
                aria-label={t('sendEmail')}
                className="transition hover:text-green"
              >
                <Mail className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com/valtterisa/student-overall-app"
                target="_blank"
                rel="noreferrer"
                aria-label={t('openGithub')}
                className="transition hover:text-green"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="w-auto pt-4 md:pt-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {t('navigation')}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition hover:text-green">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition hover:text-green">
                  {t('blog')}
                </Link>
              </li>
              <li>
                <Link href="/vari" className="transition hover:text-green">
                  {t('colors')}
                </Link>
              </li>
              <li>
                <Link href="/ala" className="transition hover:text-green">
                  {t('fields')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center border-t border-border/60 pt-4 text-center text-xs text-muted-foreground md:flex-row md:items-center ">
          <p>
            {t('builtBy')}{" "}
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
