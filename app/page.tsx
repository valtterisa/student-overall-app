import SearchContainer from "@/components/search-container";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = await createClient();
  let { data: overall_colors, error } = await supabase
    .from("overall_colors")
    .select("*");

  if (error) {
    console.error("Error fetching universities:", error);
    return [];
  }

  const universities = overall_colors ?? [];

  return (
    <>
      <div className="bg-white w-full min-h-screen flex flex-col">
        <div className="py-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-2">
            Haalarikone
          </h1>
          <p className="text-center mb-2">
            Hae <strong>värin</strong> perusteella ja löydä kenelle haalarit
            kuuluvat
          </p>
        </div>
        <SearchContainer initialUniversities={universities} />
      </div>
    </>
  );
}
