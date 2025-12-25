import { SearchModal } from "./search-modal";

interface SearchWithDividerProps {
    dividerText?: string;
    triggerLabel?: string;
    placeholder?: string;
    modalTitle?: string;
}

export function SearchWithDivider({
    dividerText = "TAI",
    triggerLabel = "Etsi haalarikoneesta",
    placeholder = "Etsi värejä, aloja, oppilaitoksia...",
    modalTitle = "Haku",
}: SearchWithDividerProps) {
    return (
        <>
            <div className="mb-8 flex justify-center">
                <SearchModal
                    triggerLabel={triggerLabel}
                    placeholder={placeholder}
                    modalTitle={modalTitle}
                />
            </div>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">{dividerText}</span>
                </div>
            </div>
        </>
    );
}

