'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SearchForm from './search-form'
import ResultsDisplay from './result-display'
import { University, universities, allColors } from '../data/mockData'

export default function SearchContainer() {
    const [results, setResults] = useState<University[]>([])
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = (criteria: { trouserColor: string; city: string; fieldOfStudy: string }) => {
        const filteredResults = universities.filter(uni => {
            const colorMatch = criteria.trouserColor
                ? allColors.some(color =>
                    color.toLowerCase().includes(criteria.trouserColor.toLowerCase()) &&
                    uni.trouserColor.toLowerCase().includes(color.toLowerCase())
                )
                : true;
            const cityMatch = !criteria.city || uni.city === criteria.city;
            const fieldMatch = !criteria.fieldOfStudy || uni.fieldOfStudy === criteria.fieldOfStudy;
            return colorMatch && cityMatch && fieldMatch;
        });
        setResults(filteredResults)
        setHasSearched(true)
    }

    return (
        <>
            <SearchForm onSearch={handleSearch} />
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

