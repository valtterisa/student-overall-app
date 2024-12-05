import SearchContainer from "@/components/search-container";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = await createClient();
  let { data: overall_colors, error } = await supabase
    .from('overall_colors')
    .select('*')

  if (error) {
    console.error('Error fetching universities:', error)
    return []
  }

  return (
    <>
      <div className="bg-white flex flex-col">
        <main className="flex-grow">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-8">
            Student Overall Search
          </h1>
          <SearchContainer initialUniversities={overall_colors} />
        </main>
      </div>
    </>
  );
}
