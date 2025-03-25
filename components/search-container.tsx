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

export type Criteria = {
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
  const [isSubmitted, setIsFormSubmitted] = useState(false);

  const handleSearch = () => {
    const filteredResults = initialUniversities.filter((uni) => {
      const colorMatch = selectedCriteria.color
        ? colorData.colors[selectedCriteria.color].main
            .concat(colorData.colors[selectedCriteria.color].shades)
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
    // For area options: ignore the selected area criteria
    const universitiesForArea = initialUniversities.filter((uni) => {
      const colorMatch = selectedCriteria.color
        ? colorData.colors[selectedCriteria.color].main
            .concat(colorData.colors[selectedCriteria.color].shades)
            .some((c) => uni.väri.toLowerCase().includes(c.toLowerCase()))
        : true;
      const fieldMatch =
        !selectedCriteria.field ||
        uni.ala?.toLowerCase().includes(selectedCriteria.field.toLowerCase());
      const schoolMatch =
        !selectedCriteria.school ||
        uni.oppilaitos
          .toLowerCase()
          .includes(selectedCriteria.school.toLowerCase());
      return colorMatch && fieldMatch && schoolMatch;
    });

    const areas = Array.from(
      new Set(universitiesForArea.map((uni) => uni.alue))
    ).sort((a, b) => a.localeCompare(b));

    // For field options: ignore the selected field criteria
    const universitiesForField = initialUniversities.filter((uni) => {
      const colorMatch = selectedCriteria.color
        ? colorData.colors[selectedCriteria.color].main
            .concat(colorData.colors[selectedCriteria.color].shades)
            .some((c) => uni.väri.toLowerCase().includes(c.toLowerCase()))
        : true;
      const areaMatch =
        !selectedCriteria.area ||
        uni.alue.toLowerCase() === selectedCriteria.area.toLowerCase();
      const schoolMatch =
        !selectedCriteria.school ||
        uni.oppilaitos
          .toLowerCase()
          .includes(selectedCriteria.school.toLowerCase());
      return colorMatch && areaMatch && schoolMatch;
    });

    const fields = Array.from(
      new Set(
        universitiesForField.flatMap((uni) =>
          uni.ala ? uni.ala.split(", ") : []
        )
      )
    ).sort((a, b) => a.localeCompare(b));

    // For school options: ignore the selected school criteria
    const universitiesForSchool = initialUniversities.filter((uni) => {
      const colorMatch = selectedCriteria.color
        ? colorData.colors[selectedCriteria.color].main
            .concat(colorData.colors[selectedCriteria.color].shades)
            .some((c) => uni.väri.toLowerCase().includes(c.toLowerCase()))
        : true;
      const areaMatch =
        !selectedCriteria.area ||
        uni.alue.toLowerCase() === selectedCriteria.area.toLowerCase();
      const fieldMatch =
        !selectedCriteria.field ||
        uni.ala?.toLowerCase().includes(selectedCriteria.field.toLowerCase());
      return colorMatch && areaMatch && fieldMatch;
    });

    const schools = Array.from(
      new Set(universitiesForSchool.map((uni) => uni.oppilaitos))
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
        onCriteriaChange={(criteria: Criteria) => setSelectedCriteria(criteria)}
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
      {!isSubmitted && <PlaceholderDisplay />}
    </div>
  );
}
