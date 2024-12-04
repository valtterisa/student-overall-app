import SearchContainer from "@/components/search-container";

export default async function Index() {
  // Query data here
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col">
        <main className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-8">
            Student Overall Search
          </h1>
          <SearchContainer />
        </main>
      </div>
    </>
  );
}
