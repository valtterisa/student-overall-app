"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchForm from "./search-form";
import ResultsDisplay from "./result-display";
import { colorData } from "../data/mockData";
import Image from "next/image";
import PlaceholderDisplay from "./placeholder-display";

export type University = {
  id: number;
  väri: string;
  hex: string;
  alue: string;
  ala?: string;
  ainejärjestö: string;
  oppilaitos: string;
};

interface SearchContainerProps {
  initialUniversities: University[];
}

export default function SearchContainer({
  initialUniversities,
}: SearchContainerProps) {
  const [selectedCriteria, setSelectedCriteria] = useState({
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

  // check if form is submitted
  const [isSubmitted, setIsFormSubmitted] = useState(false)

  const handleSearch = () => {
    const filteredResults = initialUniversities.filter((uni) => {
      const colorMatch = selectedCriteria.color
        ? colorData.colors[
          selectedCriteria.color as keyof typeof colorData.colors
        ].main
          .concat(
            colorData.colors[
              selectedCriteria.color as keyof typeof colorData.colors
            ].shades
          )
          .some((c) => uni.väri.toLowerCase().includes(c.toLowerCase()))
        : true;
      const areaMatch =
        !selectedCriteria.area ||
        uni.alue.toLowerCase() === selectedCriteria.area.toLowerCase();
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

    const orderedResults = filteredResults.sort((a, b) => {
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
  };

  const updateFilteredOptions = () => {
    const filteredUniversities = initialUniversities.filter((uni) => {
      const colorMatch = selectedCriteria.color
        ? colorData.colors[
          selectedCriteria.color as keyof typeof colorData.colors
        ].main
          .concat(
            colorData.colors[
              selectedCriteria.color as keyof typeof colorData.colors
            ].shades
          )
          .some((c) => uni.väri.toLowerCase().includes(c.toLowerCase()))
        : true;
      const areaMatch =
        !selectedCriteria.area ||
        uni.alue.toLowerCase() === selectedCriteria.area.toLowerCase();
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

    const areas = Array.from(
      new Set(filteredUniversities.map((uni) => uni.alue))
    ).sort((a, b) => a.localeCompare(b));

    const fields = Array.from(
      new Set(
        filteredUniversities.flatMap((uni) =>
          uni.ala ? uni.ala.split(", ") : []
        )
      )
    ).sort((a, b) => a.localeCompare(b));

    const schools = Array.from(
      new Set(filteredUniversities.map((uni) => uni.oppilaitos))
    ).sort((a, b) => a.localeCompare(b));

    setFilteredOptions({ areas, fields, schools });
  };

  useEffect(() => {
    updateFilteredOptions();
  }, [selectedCriteria]);

  return (
    <div className="w-full">
      <SearchForm
        onSearch={handleSearch}
        onCriteriaChange={setSelectedCriteria}
        areas={filteredOptions.areas}
        fields={filteredOptions.fields}
        schools={filteredOptions.schools}
        selectedCriteria={selectedCriteria}
        setIsFormSubmitted={setIsFormSubmitted}
        isSubmitted={isSubmitted}
      />
      {hasSearched && isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ResultsDisplay results={results} />
        </motion.div>
      )}
      {!isSubmitted && (
        <PlaceholderDisplay />
      )}

    </div>
  );
}
