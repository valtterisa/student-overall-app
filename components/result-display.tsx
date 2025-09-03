import { useState, useEffect } from "react";
import { parseStyles } from "@/lib/utils";
import Image from "next/image";
import type { University } from "@/types/university";

interface ResultsDisplayProps {
  results: University[];
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(15);

  // Calculate the total number of pages
  const totalPages = Math.ceil(results.length / resultsPerPage);

  // Slice the results based on the current page and results per page
  const paginatedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  // When results change, reset pagination
  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  // Scroll to top when page changes
  useEffect(() => {
    const topDiv = document.getElementById("top");
    if (topDiv) {
      topDiv.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div
      id="top"
      className="bg-gray-100 rounded-lg shadow-lg p-4 max-w-xl mx-auto overflow-hidden"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex justify-between items-center">
        Haun tulokset{" "}
        <span className="text-sm font-medium text-gray-500">
          ({results.length})
        </span>
      </h2>

      {results.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
          <Image
            src="/no-results.svg"
            alt="No Results"
            width={120}
            height={120}
          />
          <p className="text-gray-600 text-base">
            Haku ei tuottanut tuloksia. Kokeile muokata hakuvaihtoehtojasi.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {paginatedResults.map((uni) => (
            <li
              key={uni.id}
              className="bg-white rounded-lg shadow hover:shadow-lg min-h-[11rem] transition-shadow duration-300 p-4 flex items-center gap-4"
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
                  title={`Väri: ${uni.vari}`}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 break-all">
                  {uni.ainejärjestö ?? "Ainejärjestö ei tiedossa"}
                </h3>
                <p className="text-sm text-gray-600">
                  Väri: <span className="font-semibold">{uni.vari}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Alue: <span className="font-semibold">{uni.alue}</span>
                </p>
                {uni.ala && (
                  <p className="text-sm text-gray-600">
                    Ala: <span className="font-semibold">{uni.ala}</span>
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Oppilaitos:{" "}
                  <span className="font-semibold">{uni.oppilaitos}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      {results.length > 0 && (
        <div className="mt-6 flex justify-center items-center">
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 text-gray-700 rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edellinen
            </button>
            <p className="flex items-center text-sm text-gray-600">
              {currentPage} / {totalPages}
            </p>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-300 text-gray-700 rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Seuraava
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
