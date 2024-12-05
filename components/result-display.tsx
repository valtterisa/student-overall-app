import { parseStyles } from "@/lib/utils"
import Image from "next/image"
import { University } from "./search-container"


interface ResultsDisplayProps {
    results: University[]
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
    return (
        <div className="bg-gray-100 rounded-lg shadow-lg p-4 max-w-xl mx-auto">
            <h2 className="flex items-end gap-2 text-2xl leading-none font-bold text-gray-800 mb-4">Haun tulokset <span className="text-sm">({results.length})</span></h2>
            {results.length === 0 ? (
                // Joku kiva kuva/illustraatio jos ei hakutuloksia
                <p className="text-gray-600">Haku ei tuottanut tuloksia. Kokeile muokata hakuvaihtoehtojasi.</p>
            ) : (
                <ul className="space-y-2">
                    {results.map((uni) => (
                        <li
                            key={uni.id}
                            className="bg-white rounded-md p-4 shadow flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0"
                        >
                            <div className="flex flex-row md:flex-col gap-2">
                                <div className="w-16 h-16 rounded-lg shadow-lg" style={parseStyles(uni.hex)}></div>
                                <div className="relative w-16 h-16">
                                    <Image className="absolute object-contain" src={`/logos/${uni.oppilaitos.startsWith("Aalto-yliopisto") ? "Aalto-yliopisto" : uni.oppilaitos}.jpg`} fill alt="Oppilaitoksen logo" />

                                </div>
                            </div>
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
            )
            }
        </div >
    )
}

