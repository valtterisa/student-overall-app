import SearchContainer from "@/components/search-container";
import { promises as fs } from "fs";
import path from "path";
import type { University } from "@/types/university";

export default async function Index() {
  const jsonFilePath = path.join(process.cwd(), "data", "overall_colors.json");
  const rootJsonFilePath = path.join(process.cwd(), "overall_colors_rows.json");
  const sqlFilePath = path.join(process.cwd(), "overall_colors_rows.sql");

  let universities: University[] = [];
  try {
    const json = await fs.readFile(jsonFilePath, "utf-8");
    universities = (JSON.parse(json) as any[])
      .map(normalizeJsonToUniversity)
      .filter(Boolean) as University[];
  } catch {
    try {
      const json = await fs.readFile(rootJsonFilePath, "utf-8");
      universities = (JSON.parse(json) as any[])
        .map(normalizeJsonToUniversity)
        .filter(Boolean) as University[];
    } catch {
      
    }
  }

  return (
    <>
      <div className="bg-white w-full min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center pt-8 pb-4">
          <p className="text-sm uppercase tracking-wider text-green font-semibold mb-4">
            Suomen helpoin haalaritietokanta
          </p>
          <div className="relative">
            <h1
              className="w-fit text-4xl md:text-7xl font-bold text-center"
              style={{
                background:
                  "linear-gradient(120deg, #65a30d 0%, #65a30d 100%) no-repeat",
                backgroundPosition: "0 95%",
                backgroundSize: "100% 0.25em",
                fontWeight: "inherit",
                color: "inherit",
              }}
            >
              Haalarikone
            </h1>
          </div>

          <p className="text-center max-w-2xl mx-auto px-4 mt-6 mb-4">
            Tutustu Suomen opiskelijakulttuuriin värien kautta. Haalarikone{" "}
            <strong>auttaa sinua tunnistamaan</strong> eri alojen opiskelijat
            haalarivärien perusteella.
          </p>
        </div>
        <SearchContainer initialUniversities={universities} />
      </div>
    </>
  );
}

function normalizeJsonToUniversity(row: any): University | null {
  if (!row) return null;
  const idNum = Number(row.id);
  if (Number.isNaN(idNum)) return null;
  return {
    id: idNum,
    vari: row.vari ?? row.vari ?? "",
    hex: row.hex ?? "",
    alue: row.alue ?? "",
    ala: row.ala ?? null,
    ainejärjestö: row.ainejärjestö ?? null,
    oppilaitos: row.oppilaitos ?? "",
  };
}
