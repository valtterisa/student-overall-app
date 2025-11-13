"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import SearchForm from "./search-form";
import ResultsDisplay from "./result-display";
import PlaceholderDisplay from "./placeholder-display";
import {
  searchUniversitiesAPI,
  type UniversityWithScore,
} from "@/lib/search-utils";
import { colorData } from "../data/mockData";
import type { University } from "@/types/university";

export type Criteria = {
  textSearch: string;
  color:
    | ""
    | "punainen"
    | "sininen"
    | "vihreä"
    | "keltainen"
    | "oranssi"
    | "violetti"
    | "pinkki"
    | "black"
    | "white";
  area: string;
  field: string;
  school: string;
};

interface SearchContainerProps {
  initialUniversities: University[];
}

export default function SearchContainer({
  initialUniversities,
}: SearchContainerProps) {
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria>({
    textSearch: "",
    color: "",
    area: "",
    field: "",
    school: "",
  });

  const [draftAdvancedFilters, setDraftAdvancedFilters] = useState<
    Omit<Criteria, "textSearch">
  >({
    color: "",
    area: "",
    field: "",
    school: "",
  });

  const [filteredOptions, setFilteredOptions] = useState({
    areas: [] as string[],
    fields: [] as string[],
    schools: [] as string[],
  });

  const [results, setResults] = useState<University[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const applyFilters = useCallback(
    (universities: University[]): University[] => {
      return universities.filter((uni) => {
        const colorMatch = selectedCriteria.color
          ? colorData.colors[selectedCriteria.color].main
              .concat(colorData.colors[selectedCriteria.color].shades)
              .some((c) => uni.vari.toLowerCase().includes(c.toLowerCase()))
          : true;
        const areaMatch =
          !selectedCriteria.area ||
          uni.alue.toLowerCase().includes(selectedCriteria.area.toLowerCase());
        const fieldMatch =
          !selectedCriteria.field ||
          uni.ala?.toLowerCase().includes(selectedCriteria.field.toLowerCase());
        const schoolMatch =
          !selectedCriteria.school ||
          uni.oppilaitos
            .toLowerCase()
            .includes(selectedCriteria.school.toLowerCase());
        return colorMatch && areaMatch && fieldMatch && schoolMatch;
      });
    },
    [
      selectedCriteria.color,
      selectedCriteria.area,
      selectedCriteria.field,
      selectedCriteria.school,
    ]
  );

  const performSearch = useCallback(async () => {
    setIsSearching(true);
    let searchResults: University[] = [];

    if (selectedCriteria.textSearch.trim().length >= 2) {
      try {
        searchResults = await searchUniversitiesAPI(
          selectedCriteria.textSearch.trim()
        );
      } catch (error) {
        console.error("API search failed:", error);
        searchResults = [];
      }
    } else {
      searchResults = initialUniversities;
    }

    const filteredResults = applyFilters(searchResults);

    const orderedResults = filteredResults.sort((a, b) => {
      const aScore = "score" in a ? (a as UniversityWithScore).score : 0;
      const bScore = "score" in b ? (b as UniversityWithScore).score : 0;

      if (aScore !== bScore) {
        return bScore - aScore;
      }

      if (a.oppilaitos === b.oppilaitos) {
        if (!a.ainejärjestö && !b.ainejärjestö) return 0;
        if (!a.ainejärjestö) return 1;
        if (!b.ainejärjestö) return -1;
        return a.ainejärjestö.localeCompare(b.ainejärjestö);
      }
      return a.oppilaitos.localeCompare(b.oppilaitos);
    });

    setResults(orderedResults);
    setHasSearched(true);
    setIsSearching(false);
  }, [selectedCriteria, applyFilters, initialUniversities]);

  // Load all data on initial mount
  useEffect(() => {
    if (!hasSearched) {
      const sortedResults = initialUniversities.sort((a, b) => {
        if (a.oppilaitos === b.oppilaitos) {
          if (!a.ainejärjestö && !b.ainejärjestö) return 0;
          if (!a.ainejärjestö) return 1;
          if (!b.ainejärjestö) return -1;
          return a.ainejärjestö.localeCompare(b.ainejärjestö);
        }
        return a.oppilaitos.localeCompare(b.oppilaitos);
      });
      setResults(sortedResults);
      setHasSearched(true);
    }
  }, [hasSearched, initialUniversities]);

  useEffect(() => {
    const hasTextSearch = selectedCriteria.textSearch.trim().length >= 2;
    const hasFilters =
      selectedCriteria.color ||
      selectedCriteria.area ||
      selectedCriteria.field ||
      selectedCriteria.school;

    // If user clears everything, show all data again
    if (hasSearched && !hasTextSearch && !hasFilters) {
      const sortedResults = initialUniversities.sort((a, b) => {
        if (a.oppilaitos === b.oppilaitos) {
          if (!a.ainejärjestö && !b.ainejärjestö) return 0;
          if (!a.ainejärjestö) return 1;
          if (!b.ainejärjestö) return -1;
          return a.ainejärjestö.localeCompare(b.ainejärjestö);
        }
        return a.oppilaitos.localeCompare(b.oppilaitos);
      });
      setResults(sortedResults);
      return;
    }

    // Only perform search if user has entered text or applied filters
    if (hasTextSearch || hasFilters) {
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 300);

      return () => {
        clearTimeout(timeoutId);
        setIsSearching(false);
      };
    }
  }, [performSearch, selectedCriteria, hasSearched, initialUniversities]);

  const handleTextSearchChange = useCallback((textSearch: string) => {
    setSelectedCriteria((prev) => ({ ...prev, textSearch }));
  }, []);

  const handleDraftAdvancedFilterChange = useCallback(
    (filters: Omit<Criteria, "textSearch">) => {
      setDraftAdvancedFilters(filters);
    },
    []
  );

  const handleApplyAdvancedFilters = useCallback(() => {
    setSelectedCriteria((prev) => ({
      ...prev,
      color: draftAdvancedFilters.color,
      area: draftAdvancedFilters.area,
      field: draftAdvancedFilters.field,
      school: draftAdvancedFilters.school,
    }));
  }, [draftAdvancedFilters]);

  const handleClearAll = useCallback(() => {
    setSelectedCriteria({
      textSearch: "",
      color: "",
      area: "",
      field: "",
      school: "",
    });
    setDraftAdvancedFilters({
      color: "",
      area: "",
      field: "",
      school: "",
    });
  }, []);

  const [draftFilterResultCount, setDraftFilterResultCount] = useState(0);

  useEffect(() => {
    const calculateDraftFilterResultCount = async () => {
      let searchResults: University[] = [];

      if (selectedCriteria.textSearch.trim().length >= 2) {
        try {
          searchResults = await searchUniversitiesAPI(
            selectedCriteria.textSearch.trim()
          );
        } catch (error) {
          console.error("API search failed in draftFilterResultCount:", error);
          searchResults = [];
        }
      } else {
        searchResults = initialUniversities;
      }

      const filteredResults = searchResults.filter((uni) => {
        const colorMatch = draftAdvancedFilters.color
          ? colorData.colors[draftAdvancedFilters.color].main
              .concat(colorData.colors[draftAdvancedFilters.color].shades)
              .some((c) => uni.vari.toLowerCase().includes(c.toLowerCase()))
          : true;
        const areaMatch =
          !draftAdvancedFilters.area ||
          uni.alue
            .toLowerCase()
            .includes(draftAdvancedFilters.area.toLowerCase());
        const fieldMatch =
          !draftAdvancedFilters.field ||
          uni.ala
            ?.toLowerCase()
            .includes(draftAdvancedFilters.field.toLowerCase());
        const schoolMatch =
          !draftAdvancedFilters.school ||
          uni.oppilaitos
            .toLowerCase()
            .includes(draftAdvancedFilters.school.toLowerCase());
        return colorMatch && areaMatch && fieldMatch && schoolMatch;
      });

      setDraftFilterResultCount(filteredResults.length);
    };

    calculateDraftFilterResultCount();
  }, [selectedCriteria.textSearch, draftAdvancedFilters, initialUniversities]);

  useEffect(() => {
    setDraftAdvancedFilters({
      color: selectedCriteria.color,
      area: selectedCriteria.area,
      field: selectedCriteria.field,
      school: selectedCriteria.school,
    });
  }, [
    selectedCriteria.color,
    selectedCriteria.area,
    selectedCriteria.field,
    selectedCriteria.school,
  ]);

  return (
    <div className="w-full">
      <SearchForm
        onTextSearchChange={handleTextSearchChange}
        onDraftAdvancedFilterChange={handleDraftAdvancedFilterChange}
        onApplyAdvancedFilters={handleApplyAdvancedFilters}
        onClearAll={handleClearAll}
        areas={filteredOptions.areas}
        fields={filteredOptions.fields}
        schools={filteredOptions.schools}
        selectedCriteria={selectedCriteria}
        draftAdvancedFilters={draftAdvancedFilters}
        resultCount={results.length}
        draftFilterResultCount={draftFilterResultCount}
        hasSearched={hasSearched}
        isSearching={isSearching}
      />
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ResultsDisplay results={results} />
        </motion.div>
      )}
      {hasSearched && results.length === 0 && (
        <div className="bg-gray-100 rounded-lg shadow-lg p-8 max-w-xl mx-auto text-center">
          <p className="text-gray-600 text-lg">
            Haku ei tuottanut tuloksia. Kokeile muokata hakuehtoja.
          </p>
        </div>
      )}
      {!hasSearched && results.length === 0 && <PlaceholderDisplay />}
    </div>
  );
}
