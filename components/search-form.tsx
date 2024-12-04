'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colorPalette, cities, fieldsOfStudy } from '../data/mockData'

interface SearchFormProps {
    onSearch: (criteria: { trouserColor: string; city: string; fieldOfStudy: string }) => void
}

export default function SearchForm({ onSearch }: SearchFormProps) {

    // 1. Should not ask user for the shade. Should show chosen color first and then shades
    // 2. Switch is not working. Fuck. Ask v0 for the code.
    // 3. Internationalization
    // 4. Footer redesign. Check Saucesoft "made with love". That looks cool. 
    // 5. Add plausible analytics.
    // 6. Add proper SEO.
    // 7. Fetch the data from Supabase.

    // -- LAUNCH --
    // Add domain, host on Vercel

    // -- POST-MVP --
    // 1. Maybe add fucking wall where everyone can post. Moderate it
    // 2. Admin dashboard and add roles.

    const [selectedMainColor, setSelectedMainColor] = useState('')
    const [selectedShade, setSelectedShade] = useState('')
    const [city, setCity] = useState('')
    const [fieldOfStudy, setFieldOfStudy] = useState('')
    const [advancedSearch, setAdvancedSearch] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch({ trouserColor: selectedShade || selectedMainColor, city, fieldOfStudy })
    }

    const handleColorClick = (color: string) => {
        if (selectedMainColor === color) {
            setSelectedMainColor('')
            setSelectedShade('')
        } else {
            setSelectedMainColor(color)
            setSelectedShade('')
        }
    }

    const handleShadeClick = (shade: string) => {
        setSelectedShade(shade)
    }

    const handleReset = () => {
        setSelectedMainColor('')
        setSelectedShade('')
        setCity('')
        setFieldOfStudy('')
        setAdvancedSearch(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-100 rounded-lg shadow-lg p-6 max-w-md mx-auto mb-8"
        >
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Trouser Color:
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                        {colorPalette.map((color) => (
                            <button
                                key={color.main}
                                type="button"
                                onClick={() => handleColorClick(color.main)}
                                className={`w-full aspect-square rounded-md ${selectedMainColor === color.main ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                style={{ backgroundColor: color.main.toLowerCase() }}
                                aria-label={color.main}
                            />
                        ))}
                    </div>
                    {selectedMainColor && (
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Shade:
                            </label>
                            <div className="flex gap-2">
                                {colorPalette.find(c => c.main === selectedMainColor)?.shades.map((shade) => (
                                    <button
                                        key={shade}
                                        type="button"
                                        onClick={() => handleShadeClick(shade)}
                                        className={`flex-1 py-2 rounded-md ${selectedShade === shade ? 'ring-2 ring-blue-500' : ''
                                            }`}
                                        style={{ backgroundColor: shade.toLowerCase() }}
                                    >
                                        {shade}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="mb-4 flex items-center justify-between text-black p-3 rounded-md">
                    <span className="text-sm font-medium">Advanced Search</span>
                    {/* <Switch
                        checked={advancedSearch}
                        onCheckedChange={setAdvancedSearch}
                        className="data-[state=checked]:bg-blue-600"
                    /> */}
                </div>
                <AnimatePresence>
                    {advancedSearch && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-4 bg-gray-200 p-4 rounded-md overflow-hidden"
                        >
                            <div className="mb-4">
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                    City:
                                </label>
                                <select
                                    id="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a city</option>
                                    {cities.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
                                    Field of Study:
                                </label>
                                <select
                                    id="fieldOfStudy"
                                    value={fieldOfStudy}
                                    onChange={(e) => setFieldOfStudy(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a field of study</option>
                                    {fieldsOfStudy.map((field) => (
                                        <option key={field} value={field}>
                                            {field}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                        Search
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleReset}
                        className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-300"
                    >
                        Reset
                    </motion.button>
                </div>
            </form>
        </motion.div>
    )
}

