'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colorData } from '../data/mockData'

interface SearchFormProps {
    onSearch: (criteria: { color: string; area: string; field: string; school: string }) => void;
    areas: string[];
    fields: string[];
    schools: string[];
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <div
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer ${checked ? 'bg-gray-300' : 'bg-gray-300'
            }`}
            onClick={() => onChange(!checked)}
        >
            <motion.div
                className="bg-white w-4 h-4 rounded-full shadow-md"
                animate={{ x: checked ? 20 : 0 }}
            />
        </div>
    )
}

export default function SearchForm({ onSearch, areas, fields, schools }: SearchFormProps) {
    const [selectedColor, setSelectedColor] = useState('')
    const [area, setArea] = useState('')
    const [field, setField] = useState('')
    const [school, setSchool] = useState('')
    const [advancedSearch, setAdvancedSearch] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch({ color: selectedColor, area, field, school })
    }

    const handleColorClick = (color: string) => {
        setSelectedColor(selectedColor === color ? '' : color)
    }

    const handleReset = () => {
        setSelectedColor('')
        setArea('')
        setField('')
        setSchool('')
        setAdvancedSearch(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-100 rounded-lg shadow-lg p-6 max-w-xl w-full mx-auto mb-8"
        >
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valitse väri:
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                        {Object.entries(colorData.colors).map(([color, data]) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => handleColorClick(color)}
                                className={`w-full aspect-square rounded-md ${selectedColor === color ? 'ring-2 ring-black' : ''
                                }`}
                                style={{ backgroundImage: `linear-gradient(to bottom right, ${color}, ${data.alt})` }}
                                aria-label={data.main[0]}
                            />
                        ))}
                    </div>
                </div>
                <div className="mb-4 flex items-center justify-between bg-lime-600 text-white p-3 rounded-md">
                    <span className="text-sm font-medium">Tarkempi haku</span>
                    <Switch
                        checked={advancedSearch}
                        onChange={setAdvancedSearch}
                    />
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
                                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                                    Kaupunki:
                                </label>
                                <select
                                    id="area"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
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
                                <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-2">
                                    Opiskeluala:
                                </label>
                                <select
                                    id="field"
                                    value={field}
                                    onChange={(e) => setField(e.target.value)}
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
                                <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                                    Oppilaitos:
                                </label>
                                <select
                                    id="school"
                                    value={school}
                                    onChange={(e) => setSchool(e.target.value)}
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
                </AnimatePresence>
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
                        onClick={handleReset}
                        className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-300"
                    >
                        Tyhjennä
                    </motion.button>
                </div>
            </form>
        </motion.div>
    )
}
