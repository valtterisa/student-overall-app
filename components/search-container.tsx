'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SearchForm from './search-form'
import ResultsDisplay from './result-display'
import { colorData } from '../data/mockData'

export type University = {
    id: number;
    väri: string;
    hex: string;
    alue: string;
    ala?: string;
    ainejärjestö: string;
    oppilaitos: string;
}

interface SearchContainerProps {
    initialUniversities: University[];
}

export default function SearchContainer({ initialUniversities }: SearchContainerProps) {

    const getAreas = (initialUniversities: University[]) => Array.from(new Set(initialUniversities.map(u => u.alue))).sort((a, b) => a.localeCompare(b));
    const getFields = (initialUniversities: University[]) =>
        Array.from(
            new Set(
                initialUniversities
                    .flatMap(u => (u.ala ? u.ala.split(', ') : [])) // Handle null or undefined
            )
        ).sort((a, b) => a.localeCompare(b));
    const getSchools = (initialUniversities: University[]) =>
        Array.from(new Set(initialUniversities.map(u => u.oppilaitos))).sort((a, b) => a.localeCompare(b));

    const [results, setResults] = useState<University[]>([])
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = (criteria: { color: string; area: string; field: string; school: string }) => {
        const filteredResults = initialUniversities.filter(uni => {
            const colorMatch = criteria.color
                ? (colorData.colors[criteria.color as keyof typeof colorData.colors].main
                    .concat(colorData.colors[criteria.color as keyof typeof colorData.colors].shades)
                    .some(c => uni.väri.toLowerCase().includes(c.toLowerCase())))
                : true;
            const areaMatch = !criteria.area || uni.alue.toLowerCase() === criteria.area.toLowerCase();
            const fieldMatch = !criteria.field || uni.ala?.toLowerCase().includes(criteria.field.toLowerCase());
            const schoolMatch = !criteria.school || uni.oppilaitos.toLowerCase().includes(criteria.school.toLowerCase());
            return colorMatch && areaMatch && fieldMatch && schoolMatch;
        });

        const orderedResults = filteredResults.sort((a, b) => {
            if (a.oppilaitos === b.oppilaitos) {
                // Sort alphabetically by ainejärjestö within the same school
                if (!a.ainejärjestö && !b.ainejärjestö) return 0;
                if (!a.ainejärjestö) return 1;
                if (!b.ainejärjestö) return -1;
                return a.ainejärjestö.localeCompare(b.ainejärjestö);
            }
            // Sort by oppilaitos alphabetically
            return a.oppilaitos.localeCompare(b.oppilaitos);
        });

        setResults(orderedResults)
        setHasSearched(true)
    }

    return (
        <>
            <SearchForm
                onSearch={handleSearch}
                areas={getAreas(initialUniversities)}
                fields={getFields(initialUniversities)}
                schools={getSchools(initialUniversities)}
            />
            {hasSearched && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ResultsDisplay results={results} />
                </motion.div>
            )}
        </>
    )
}
