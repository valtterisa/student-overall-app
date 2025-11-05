import { useState, useEffect } from "react";
import Image from "next/image";
import type { University } from "@/types/university";
import UniversityCard from "@/components/university-card";

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
    <div id="top" className="max-w-2xl w-full mx-auto mb-8 px-2">
      <div className="bg-white rounded-lg border border-border shadow-sm p-4">
        <h2 className="text-base font-semibold text-foreground mb-4 flex justify-between items-center">
          Haun tulokset{" "}
          <span className="text-xs text-muted-foreground">
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
            <p className="text-muted-foreground text-sm">
              Haku ei tuottanut tuloksia. Kokeile muokata hakuvaihtoehtojasi.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {paginatedResults.map((uni) => (
              <UniversityCard key={uni.id} uni={uni} />
            ))}
          </ul>
        )}

        {/* Pagination Controls */}
        {results.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex justify-center items-center">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 px-3 text-xs bg-white text-foreground border border-input hover:bg-muted rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Edellinen
              </button>
              <p className="flex items-center text-xs text-muted-foreground px-3">
                {currentPage} / {totalPages}
              </p>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 px-3 text-xs bg-white text-foreground border border-input hover:bg-muted rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Seuraava
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
