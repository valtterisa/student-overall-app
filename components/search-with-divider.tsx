"use client";

import { SearchModal } from "./search-modal";
import { useTranslations } from 'next-intl';

interface SearchWithDividerProps {
    dividerText?: string;
    triggerLabel?: string;
    placeholder?: string;
    modalTitle?: string;
}

export function SearchWithDivider({
    dividerText,
    triggerLabel,
    placeholder,
    modalTitle,
}: SearchWithDividerProps) {
    const t = useTranslations('search');

    const finalDividerText = dividerText ?? t('orSelect');
    const finalTriggerLabel = triggerLabel ?? t('title');
    const finalPlaceholder = placeholder ?? t('searchPlaceholder');
    const finalModalTitle = modalTitle ?? t('title');
    return (
        <>
            <div className="mb-8 flex justify-center">
                <SearchModal
                    triggerLabel={finalTriggerLabel}
                    placeholder={finalPlaceholder}
                    modalTitle={finalModalTitle}
                />
            </div>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">{finalDividerText}</span>
                </div>
            </div>
        </>
    );
}

