"use client";

import { useState } from "react";
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
  resultCount,
  draftFilterResultCount,
  hasSearched,
  isSearching = false,
}: SearchFormProps) {
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isUpserting, setIsUpserting] = useState(false);
  const [upsertSuccess, setUpsertSuccess] = useState(false);

  const handleTextSearchChange = (value: string) => {
    onTextSearchChange(value);
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

  const handleUpsert = async () => {
    setIsUpserting(true);
    setUpsertSuccess(false);
    try {
      const res = await fetch("/api/upsert", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setUpsertSuccess(true);
        setTimeout(() => setUpsertSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Upsert error:", error);
    } finally {
      setIsUpserting(false);
    }
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
      className="max-w-2xl w-full mx-auto mb-8 px-2"
    >
      <div className="bg-white rounded-lg border border-border shadow-sm p-4">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
              <Input
                id="text-search"
                type="text"
                value={selectedCriteria.textSearch}
                onChange={(e) => handleTextSearchChange(e.target.value)}
                placeholder="Kirjoita esim. yliopiston nimi, ala tai väri..."
                className="pl-9 pr-9 h-10 text-sm bg-white text-foreground border-input focus:ring-0 focus-visible:ring-0"
                disabled={isSearching}
              />
              {isSearching && (
                <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-green border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {selectedCriteria.textSearch && !isSearching && (
                <button
                  type="button"
                  onClick={() => handleTextSearchChange("")}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition p-1 rounded hover:bg-muted"
                  aria-label="Tyhjennä haku"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-border/50">
            <Collapsible
              open={isAdvancedSearchOpen}
              onOpenChange={setIsAdvancedSearchOpen}
            >
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-between py-1.5 px-0 text-left hover:opacity-70 transition-opacity group"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Suodattimet
                    </span>
                    {hasActiveFilters && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-green text-white rounded-full font-medium">
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
                    <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 pl-4 border-l border-muted/30 space-y-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="color"
                    className="text-xs text-muted-foreground font-medium"
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
                      className="h-8 text-sm bg-white text-foreground border-input focus:ring-0 focus-visible:ring-0"
                    >
                      <SelectValue placeholder="Valitse väri" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {Object.entries(colorData.colors).map(
                        ([colorKey, data]) => (
                          <SelectItem
                            key={colorKey}
                            value={colorKey}
                            className="text-sm text-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3.5 h-3.5 rounded border"
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

                <div className="space-y-1.5">
                  <Label
                    htmlFor="area"
                    className="text-xs text-muted-foreground font-medium"
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
                      className="h-8 text-sm bg-white text-foreground border-input focus:ring-0 focus-visible:ring-0"
                    >
                      <SelectValue placeholder="Valitse kaupunki" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {areas.map((a) => (
                        <SelectItem
                          key={a}
                          value={a}
                          className="text-sm text-foreground"
                        >
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="field"
                    className="text-xs text-muted-foreground font-medium"
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
                      className="h-8 text-sm bg-white text-foreground border-input focus:ring-0 focus-visible:ring-0"
                    >
                      <SelectValue placeholder="Valitse opiskeluala" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {fields.map((f) => (
                        <SelectItem
                          key={f}
                          value={f}
                          className="text-sm text-foreground"
                        >
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="school"
                    className="text-xs text-muted-foreground font-medium"
                  >
                    Oppilaitos
                  </Label>
                  <Select
                    key={selectedCriteria.school || "school-empty"}
                    value={draftAdvancedFilters.school || undefined}
                    onValueChange={(value) =>
                      handleDraftChange("school", value)
                    }
                  >
                    <SelectTrigger
                      id="school"
                      className="h-8 text-sm bg-white text-foreground border-input focus:ring-0 focus-visible:ring-0"
                    >
                      <SelectValue placeholder="Valitse oppilaitos" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {schools.map((s) => (
                        <SelectItem
                          key={s}
                          value={s}
                          className="text-sm text-foreground"
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
                    className="h-10 text-sm bg-green hover:bg-green/90 text-white mt-2"
                  >
                    Suodata{" "}
                    {draftFilterResultCount >= 0 &&
                      `(${draftFilterResultCount})`}
                  </Button>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="flex mt-2">
            {(selectedCriteria.textSearch || hasActiveFilters) && (
              <Button
                variant="outline"
                onClick={handleClear}
                className="h-10 text-sm bg-white text-foreground border-input hover:bg-muted flex-1"
                type="button"
              >
                <X className="w-4 h-4 mr-2" />
                Tyhjennä
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
