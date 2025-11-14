"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Search as SearchIcon,
  ChevronDown,
  ChevronUp,
  X,
  Settings,
} from "lucide-react";
import { Criteria } from "./search-container";
import { colorData } from "../data/mockData";
import { track } from "@databuddy/sdk";

interface SearchFormProps {
  onTextSearchChange: (textSearch: string) => void;
  onDraftAdvancedFilterChange: (filters: Omit<Criteria, "textSearch">) => void;
  onApplyAdvancedFilters: () => void;
  onClearAll: () => void;
  areas: string[];
  fields: string[];
  schools: string[];
  selectedCriteria: Criteria;
  draftAdvancedFilters: Omit<Criteria, "textSearch">;
  resultCount: number;
  draftFilterResultCount: number;
  hasSearched: boolean;
  isSearching?: boolean;
}

export default function SearchForm({
  onTextSearchChange,
  onDraftAdvancedFilterChange,
  onApplyAdvancedFilters,
  onClearAll,
  areas,
  fields,
  schools,
  selectedCriteria,
  draftAdvancedFilters,
  draftFilterResultCount,
  isSearching = false,
}: SearchFormProps) {
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState(
    selectedCriteria.textSearch
  );
  const lastTrackedSearchRef = useRef<string>("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalSearchValue(selectedCriteria.textSearch);
  }, [selectedCriteria.textSearch]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const wasEmpty = !lastTrackedSearchRef.current;
      const isEmpty = !localSearchValue.trim();

      if (wasEmpty && !isEmpty) {
        track("search_change", {
          button_text: "Text search change",
          location: "search_form",
        });
        lastTrackedSearchRef.current = localSearchValue;
      } else if (isEmpty) {
        lastTrackedSearchRef.current = "";
      }

      onTextSearchChange(localSearchValue);
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [localSearchValue, onTextSearchChange]);

  const handleTextSearchChange = (value: string) => {
    setLocalSearchValue(value);
  };

  const handleDraftChange = (
    field: "color" | "area" | "field" | "school",
    value: string
  ) => {
    onDraftAdvancedFilterChange({ ...draftAdvancedFilters, [field]: value });
  };

  const handleClear = () => {
    onClearAll();
    setIsAdvancedSearchOpen(false);
  };

  const hasActiveFilters =
    selectedCriteria.color ||
    selectedCriteria.area ||
    selectedCriteria.field ||
    selectedCriteria.school;

  const hasDraftChanges =
    draftAdvancedFilters.color !== selectedCriteria.color ||
    draftAdvancedFilters.area !== selectedCriteria.area ||
    draftAdvancedFilters.field !== selectedCriteria.field ||
    draftAdvancedFilters.school !== selectedCriteria.school;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl w-full mx-auto mb-4 sm:mb-8 px-2"
    >
      <div className="bg-white rounded-lg border border-border shadow-sm">
        <div className="px-3 pt-4 pb-3 sm:px-6 sm:pt-8 sm:pb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 sm:left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-6 sm:h-6 pointer-events-none z-10" />
            <Input
              id="text-search"
              type="text"
              value={localSearchValue}
              onChange={(e) => handleTextSearchChange(e.target.value)}
              placeholder="Kerro mitä etsit?"
              className="pl-10 pr-10 sm:pl-16 sm:pr-16 h-12 sm:h-16 text-sm sm:text-lg bg-white text-foreground border-input focus:ring-2 focus:ring-green/30 focus-visible:ring-2 focus-visible:ring-green/30 border-2 shadow-sm hover:shadow-md transition-shadow"
              disabled={isSearching}
            />
            {isSearching && (
              <div className="absolute right-3 sm:right-6 top-1/2 transform -translate-y-1/2 z-10">
                <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {localSearchValue && !isSearching && (
              <button
                type="button"
                onClick={() => handleTextSearchChange("")}
                className="absolute right-3 sm:right-6 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition p-1 sm:p-2 rounded hover:bg-muted z-10"
                aria-label="Tyhjennä haku"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="px-3 pb-3 pt-3 sm:px-6 sm:pb-6 sm:pt-4 border-t border-border/50">
          <Collapsible
            open={isAdvancedSearchOpen}
            onOpenChange={setIsAdvancedSearchOpen}
          >
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between py-1 sm:py-1.5 px-0 text-left hover:opacity-70 transition-opacity group"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Suodattimet
                  </span>
                  {hasActiveFilters && (
                    <span className="ml-1 px-1 py-0.5 sm:ml-1.5 sm:px-1.5 text-[9px] sm:text-[10px] bg-green text-white rounded-full font-medium">
                      {
                        [
                          selectedCriteria.color,
                          selectedCriteria.area,
                          selectedCriteria.field,
                          selectedCriteria.school,
                        ].filter(Boolean).length
                      }
                    </span>
                  )}
                </div>
                {isAdvancedSearchOpen ? (
                  <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 sm:mt-3 pl-2 sm:pl-4 border-l border-muted/30 space-y-2 sm:space-y-3">
              <div className="space-y-1 sm:space-y-1.5">
                <Label
                  htmlFor="color"
                  className="text-[10px] sm:text-xs text-muted-foreground font-medium"
                >
                  Väri
                </Label>
                <Select
                  key={selectedCriteria.color || "color-empty"}
                  value={draftAdvancedFilters.color || undefined}
                  onValueChange={(value) => handleDraftChange("color", value)}
                >
                  <SelectTrigger
                    id="color"
                    className="h-7 sm:h-8 text-xs sm:text-sm bg-white text-foreground border-input focus:ring-0 focus-visible:ring-0"
                  >
                    <SelectValue placeholder="Valitse väri" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Object.entries(colorData.colors).map(
                      ([colorKey, data]) => (
                        <SelectItem
                          key={colorKey}
                          value={colorKey}
                          className="text-xs sm:text-sm text-foreground"
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded border"
                              style={{
                                backgroundImage: `linear-gradient(to bottom right, ${data.color}, ${data.alt})`,
                              }}
                            />
                            <span>{data.main[0]}</span>
                          </div>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <Label
                  htmlFor="area"
                  className="text-[10px] sm:text-xs text-muted-foreground font-medium"
                >
                  Kaupunki
                </Label>
                <Select
                  key={selectedCriteria.area || "area-empty"}
                  value={draftAdvancedFilters.area || undefined}
                  onValueChange={(value) => handleDraftChange("area", value)}
                >
                  <SelectTrigger
                    id="area"
                    className="h-7 sm:h-8 text-xs sm:text-sm bg-white text-foreground border-input focus:ring-0 focus-visible:ring-0"
                  >
                    <SelectValue placeholder="Valitse kaupunki" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {areas.map((a) => (
                      <SelectItem
                        key={a}
                        value={a}
                        className="text-xs sm:text-sm text-foreground"
                      >
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <Label
                  htmlFor="field"
                  className="text-[10px] sm:text-xs text-muted-foreground font-medium"
                >
                  Opiskeluala
                </Label>
                <Select
                  key={selectedCriteria.field || "field-empty"}
                  value={draftAdvancedFilters.field || undefined}
                  onValueChange={(value) => handleDraftChange("field", value)}
                >
                  <SelectTrigger
                    id="field"
                    className="h-7 sm:h-8 text-xs sm:text-sm bg-white text-foreground border-input focus:ring-0 focus-visible:ring-0"
                  >
                    <SelectValue placeholder="Valitse opiskeluala" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {fields.map((f) => (
                      <SelectItem
                        key={f}
                        value={f}
                        className="text-xs sm:text-sm text-foreground"
                      >
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <Label
                  htmlFor="school"
                  className="text-[10px] sm:text-xs text-muted-foreground font-medium"
                >
                  Oppilaitos
                </Label>
                <Select
                  key={selectedCriteria.school || "school-empty"}
                  value={draftAdvancedFilters.school || undefined}
                  onValueChange={(value) => handleDraftChange("school", value)}
                >
                  <SelectTrigger
                    id="school"
                    className="h-7 sm:h-8 text-xs sm:text-sm bg-white text-foreground border-input focus:ring-0 focus-visible:ring-0"
                  >
                    <SelectValue placeholder="Valitse oppilaitos" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {schools.map((s) => (
                      <SelectItem
                        key={s}
                        value={s}
                        className="text-xs sm:text-sm text-foreground"
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasDraftChanges && (
                <Button
                  type="button"
                  onClick={onApplyAdvancedFilters}
                  className="h-9 sm:h-10 text-xs sm:text-sm bg-green hover:bg-green/90 text-white mt-2"
                >
                  Suodata{" "}
                  {draftFilterResultCount >= 0 && `(${draftFilterResultCount})`}
                </Button>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {(selectedCriteria.textSearch || hasActiveFilters) && (
          <div className="px-3 pb-3 sm:px-6 sm:pb-6 flex mt-2">
            <Button
              variant="outline"
              onClick={handleClear}
              className="h-9 sm:h-10 text-xs sm:text-sm bg-white text-foreground border-input hover:bg-muted flex-1"
              type="button"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Tyhjennä
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
