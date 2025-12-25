"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

export function LanguageSwitcher() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const localeFromParams = params?.locale as string | undefined;
  const localeFromHook = useLocale();
  const locale = localeFromParams || localeFromHook || 'fi';

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-1">
      <Button
        variant={locale === 'fi' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLocale('fi')}
        className={locale === 'fi' ? 'bg-green text-white hover:bg-green/90' : ''}
      >
        FI
      </Button>
      <Button
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLocale('en')}
        className={locale === 'en' ? 'bg-green text-white hover:bg-green/90' : ''}
      >
        EN
      </Button>
      <Button
        variant={locale === 'sv' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLocale('sv')}
        className={locale === 'sv' ? 'bg-green text-white hover:bg-green/90' : ''}
      >
        SV
      </Button>
    </div>
  );
}

