"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
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
import { Search, ChevronDown, ChevronUp, X, Settings, Check } from "lucide-react";
import { Criteria } from "./search-container";
import { colorData } from "../data/mockData";

interface SearchFormProps {
  onTextSearchChange: (textSearch: string) => void;
  onDraftAdvancedFilterChange: (filters: Omit<Criteria, "textSearch">) => void;
  onApplyAdvancedFilters: () => void;
  areas: string[];
  fields: string[];
  schools: string[];
  selectedCriteria: Criteria;
  draftAdvancedFilters: Omit<Criteria, "textSearch">;
  resultCount: number;
  hasSearched: boolean;
}

export default function SearchForm({
  onTextSearchChange,
  onDraftAdvancedFilterChange,
  onApplyAdvancedFilters,
  areas,
  fields,
  schools,
  selectedCriteria,
  draftAdvancedFilters,
  resultCount,
  hasSearched,
}: SearchFormProps) {
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

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
    onTextSearchChange("");
    onDraftAdvancedFilterChange({
      color: "",
      area: "",
      field: "",
      school: "",
    });
    onApplyAdvancedFilters();
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl w-full mx-auto mb-8"
    >
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="text-search" className="text-base font-semibold">
                Hae haalarivärejä
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                <Input
                  id="text-search"
                  type="text"
                  value={selectedCriteria.textSearch}
                  onChange={(e) => handleTextSearchChange(e.target.value)}
                  placeholder="Kirjoita esim. yliopiston nimi, ala tai väri..."
                  className="pl-10 pr-10 h-12 text-base"
                />
                {selectedCriteria.textSearch && (
                  <button
                    type="button"
                    onClick={() => handleTextSearchChange("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    aria-label="Tyhjennä haku"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {hasSearched && (
                <p className="text-sm text-muted-foreground">
                  {resultCount} tulosta
                </p>
              )}
            </div>

            <Collapsible
              open={isAdvancedSearchOpen}
              onOpenChange={setIsAdvancedSearchOpen}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between"
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>Tarkemmat suodattimet</span>
                    {hasActiveFilters && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-green text-white rounded-full">
                        Aktiivinen
                      </span>
                    )}
                  </div>
                  {isAdvancedSearchOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Väri</Label>
                  <Select
                    value={draftAdvancedFilters.color || undefined}
                    onValueChange={(value) => handleDraftChange("color", value)}
                  >
                    <SelectTrigger id="color">
                      <SelectValue placeholder="Valitse väri" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(colorData.colors).map(([colorKey, data]) => (
                        <SelectItem key={colorKey} value={colorKey}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{
                                backgroundImage: `linear-gradient(to bottom right, ${data.color}, ${data.alt})`,
                              }}
                            />
                            <span>{data.main[0]}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {draftAdvancedFilters.color && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleDraftChange("color", "")}
                    >
                      Poista värin suodatin
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Kaupunki</Label>
                  <Select
                    value={draftAdvancedFilters.area || undefined}
                    onValueChange={(value) => handleDraftChange("area", value)}
                  >
                    <SelectTrigger id="area">
                      <SelectValue placeholder="Valitse kaupunki" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {draftAdvancedFilters.area && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleDraftChange("area", "")}
                    >
                      Poista kaupungin suodatin
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field">Opiskeluala</Label>
                  <Select
                    value={draftAdvancedFilters.field || undefined}
                    onValueChange={(value) => handleDraftChange("field", value)}
                  >
                    <SelectTrigger id="field">
                      <SelectValue placeholder="Valitse opiskeluala" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {draftAdvancedFilters.field && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleDraftChange("field", "")}
                    >
                      Poista alan suodatin
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">Oppilaitos</Label>
                  <Select
                    value={draftAdvancedFilters.school || undefined}
                    onValueChange={(value) => handleDraftChange("school", value)}
                  >
                    <SelectTrigger id="school">
                      <SelectValue placeholder="Valitse oppilaitos" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {draftAdvancedFilters.school && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleDraftChange("school", "")}
                    >
                      Poista oppilaitoksen suodatin
                    </Button>
                  )}
                </div>

                {hasDraftChanges && (
                  <Button
                    type="button"
                    onClick={onApplyAdvancedFilters}
                    className="w-full bg-green hover:bg-green/90 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Sovella suodattimet
                  </Button>
                )}
              </CollapsibleContent>
            </Collapsible>

            {(selectedCriteria.textSearch || hasActiveFilters) && (
              <Button
                variant="outline"
                onClick={handleClear}
                className="w-full"
                type="button"
              >
                <X className="w-4 h-4 mr-2" />
                Tyhjennä kaikki
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
