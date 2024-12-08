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
      <div className="bg-white w-full min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center pt-8 pb-4">
          <h1
            className="w-fit text-4xl md:text-7xl font-bold text-center"
            style={{
              background: 'linear-gradient(120deg, #65a30d 0%, #65a30d 100%) no-repeat',
              backgroundPosition: '0 95%',
              backgroundSize: '100% 0.25em',
              fontWeight: 'inherit',
              color: 'inherit',
            }}
          >
            Haalarikone
          </h1>
          <p className="text-center max-w-2xl mx-auto mt-6 mb-4">
            Tutustu Suomen opiskelijakulttuuriin värien kautta. Haalarikone <strong>auttaa sinua tunnistamaan</strong> eri alojen opiskelijat haalarivärien perusteella.
          </p>
        </div>
        <SearchContainer initialUniversities={universities} />
      </div>
    </>
  );
}
