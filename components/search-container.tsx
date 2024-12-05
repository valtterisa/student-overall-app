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
    ala: string;
    ainejärjestö: string;
    oppilaitos: string;
}



interface SearchContainerProps {
    initialUniversities: University[];
}

export default function SearchContainer({ initialUniversities }: SearchContainerProps) {
    console.log(initialUniversities)

    const getAreas = (initialUniversities: University[]) => Array.from(new Set(initialUniversities.map(u => u.alue)));
    const getFields = (initialUniversities: University[]) =>
        Array.from(
            new Set(
                initialUniversities
                    .flatMap(u => (u.ala ? u.ala.split(', ') : [])) // Handle null or undefined
            )
        );

    const [results, setResults] = useState<University[]>([])
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = (criteria: { color: string; area: string; field: string }) => {
        const filteredResults = initialUniversities.filter(uni => {
            const colorMatch = criteria.color
                ? colorData.colors[criteria.color].main.concat(colorData.colors[criteria.color].shades).some(c => uni.väri.toLowerCase().includes(c.toLowerCase()))
                : true;
            const areaMatch = !criteria.area || uni.alue.toLowerCase() === criteria.area.toLowerCase();
            const fieldMatch = !criteria.field || uni.ala.toLowerCase().includes(criteria.field.toLowerCase());
            return colorMatch && areaMatch && fieldMatch;
        });
        setResults(filteredResults)
        setHasSearched(true)
    }

    return (
        <>
            <SearchForm onSearch={handleSearch} areas={getAreas(initialUniversities)} fields={getFields(initialUniversities)} />
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

