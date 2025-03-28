"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { colorData } from "../data/mockData";
import { Switch } from "./ui/switch";
import { Check } from "lucide-react";
import { Criteria } from "./search-container";

interface SearchFormProps {
  onSearch: () => void;
  onCriteriaChange: (criteria: Criteria) => void;
  areas: string[];
  fields: string[];
  schools: string[];
  selectedCriteria: Criteria;
  setIsFormSubmitted: (isSubmitted: boolean) => void;
  isSubmitted: boolean;
}

export default function SearchForm({
  onSearch,
  onCriteriaChange,
  areas,
  fields,
  schools,
  selectedCriteria,
  isSubmitted,
  setIsFormSubmitted,
}: SearchFormProps) {
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  // Only allow changing non-color fields via this handler.
  const handleChange = (field: "area" | "field" | "school", value: string) => {
    onCriteriaChange({ ...selectedCriteria, [field]: value });
  };

  // Ensure the color parameter is one of the allowed union values.
  const handleColorClick = (color: Criteria["color"]) => {
    if (color === selectedCriteria.color) {
      onCriteriaChange({ ...selectedCriteria, color: "" });
    } else {
      onCriteriaChange({ ...selectedCriteria, color: color });
    }
  };

  const toggleAdvancedSearch = () => {
    setIsAdvancedSearchOpen((prevState) => !prevState);
  };

  const handleClear = () => {
    onCriteriaChange({
      color: "",
      area: "",
      field: "",
      school: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh on submit
    setIsFormSubmitted(true);
    onSearch();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 rounded-lg shadow-lg p-6 max-w-xl w-full mx-auto mb-8"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="relative grid grid-cols-3 gap-2 mb-2">
            {Object.entries(colorData.colors).map(([color, data]) => (
              <div key={color} className="relative">
                <button
                  type="button"
                  onClick={() => handleColorClick(color as Criteria["color"])}
                  className={`w-full aspect-square rounded-md ${
                    selectedCriteria.color === color ? "ring-2 ring-black" : ""
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, ${data.color}, ${data.alt})`,
                  }}
                  aria-label={data.main[0]}
                />
                {selectedCriteria.color === color && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Check
                      className={`text-${
                        color === "white" ? "black" : "white"
                      } md:w-12 md:h-12`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between bg-lime-600 text-white p-3 rounded-md">
          <span className="font-semibold">Tarkempi haku</span>
          <Switch
            checked={isAdvancedSearchOpen}
            onChange={toggleAdvancedSearch}
          />
        </div>

        {isAdvancedSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 bg-gray-200 p-4 rounded-md overflow-hidden"
          >
            <div className="mb-4">
              <label
                htmlFor="area"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Kaupunki:
              </label>
              <select
                id="area"
                value={selectedCriteria.area}
                onChange={(e) => handleChange("area", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                <option value="">Valitse kaupunki</option>
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="field"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Opiskeluala:
              </label>
              <select
                id="field"
                value={selectedCriteria.field}
                onChange={(e) => handleChange("field", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                <option value="">Valitse opiskeluala</option>
                {fields.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="school"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Oppilaitos:
              </label>
              <select
                id="school"
                value={selectedCriteria.school}
                onChange={(e) => handleChange("school", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                <option value="">Valitse oppilaitos</option>
                {schools.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex-1 bg-lime-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-lime-700 transition-colors duration-300"
          >
            Hae tulokset
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleClear}
            className="flex-1 bg-gray-300 max-w-48 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-300"
          >
            Tyhjennä
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
