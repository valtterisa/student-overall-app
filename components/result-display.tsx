import Image from 'next/image'
import { University } from '../data/mockData'

interface ResultsDisplayProps {
    results: University[]
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
    return (
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Results</h2>
            {results.length === 0 ? (
                <p className="text-gray-600">No results found. Try adjusting your search criteria.</p>
            ) : (
                <ul className="space-y-4">
                    {results.map((uni) => (
                        <li
                            key={uni.id}
                            className="bg-white rounded-md p-4 shadow flex items-center space-x-4"
                        >
                            <Image
                                src={uni.imageUrl}
                                alt={uni.name}
                                width={100}
                                height={100}
                                className="rounded-md"
                            />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{uni.name}</h3>
                                <p className="text-gray-600">City: {uni.city}</p>
                                <p className="text-gray-600">Field of Study: {uni.fieldOfStudy}</p>
                                <p className="text-gray-600">Trouser Color: {uni.trouserColor}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

