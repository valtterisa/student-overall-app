import { parseStyles } from "@/lib/utils"
import Image from "next/image"
import { University } from "./search-container"

interface ResultsDisplayProps {
    results: University[]
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
    return (
        <div className="bg-gray-100 rounded-lg shadow-lg p-4 max-w-xl mx-auto overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex justify-between items-center">
                Haun tulokset <span className="text-sm font-medium text-gray-500">({results.length})</span>
            </h2>
            {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <Image
                        src="/no-results.png" // Add an illustration or placeholder
                        alt="No Results"
                        width={120}
                        height={120}
                    />
                    <p className="text-gray-600 text-base">Haku ei tuottanut tuloksia. Kokeile muokata hakuvaihtoehtojasi.</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {results.map((uni) => (
                        <li
                            key={uni.id}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 p-4 flex items-start gap-4"
                        >
                            <div className="flex-none">
                                <div className="relative w-14 h-14 rounded-md overflow-hidden">
                                    <Image
                                        className="absolute object-contain"
                                        src={`/logos/${uni.oppilaitos.startsWith("Aalto-yliopisto") ? "Aalto-yliopisto" : uni.oppilaitos}.jpg`}
                                        fill
                                        alt="Oppilaitoksen logo"
                                    />
                                </div>
                                <div
                                    className="w-14 h-14 rounded mt-2 shadow"
                                    style={parseStyles(uni.hex)}
                                    title={`Väri: ${uni.väri}`}
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900 break-all">
                                    {uni.ainejärjestö ?? "Ainejärjestö ei tiedossa"}
                                </h3>
                                <p className="text-sm text-gray-600">Väri: <span className="font-semibold">{uni.väri}</span></p>
                                <p className="text-sm text-gray-600">Alue: <span className="font-semibold">{uni.alue}</span></p>
                                {uni.ala && (
                                    <p className="text-sm text-gray-600">Ala: <span className="font-semibold">{uni.ala}</span></p>
                                )}
                                <p className="text-sm text-gray-600">Oppilaitos: <span className="font-semibold">{uni.oppilaitos}</span></p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
