import { University } from "./search-container"

interface ResultsDisplayProps {
    results: University[]
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
    return (
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Haun tulokset</h2>
            {results.length === 0 ? (
                <p className="text-gray-600">No results found. Try adjusting your search criteria.</p>
            ) : (
                <ul className="space-y-4">
                    {results.map((uni) => (
                        <li
                            key={uni.id}
                            className="bg-white rounded-md p-4 shadow flex items-center space-x-4"
                        >
                            <div className="w-16 h-16 rounded-lg" style={{ cssText: uni.hex.substring(0, uni.hex.length - 1) }}></div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{uni.oppilaitos}</h3>
                                <p className="text-gray-600">Väri: {uni.väri}</p>
                                <p className="text-gray-600">Alue: {uni.alue}</p>
                                <p className="text-gray-600">Ala: {uni.ala}</p>
                                <p className="text-gray-600">Ainejärjestö: {uni.ainejärjestö}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

