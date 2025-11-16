import { promises as fs } from "fs";
import path from "path";
import type { University } from "@/types/university";

function normalizeJsonToUniversity(row: any): University | null {
  if (!row) return null;
  const idNum = Number(row.id);
  if (Number.isNaN(idNum)) return null;

  const content = row.content || {};
  const metadata = row.metadata || {};

  return {
    id: idNum,
    vari: content.vari ?? "",
    hex: metadata.hex ?? "",
    alue: content.alue ?? "",
    ala: content.ala || null,
    ainejärjestö: content.ainejärjestö || null,
    oppilaitos: content.oppilaitos ?? "",
  };
}

export async function loadUniversities(): Promise<University[]> {
  const jsonFilePath = path.join(process.cwd(), "data", "overall_colors_upstash.json");

  try {
    const json = await fs.readFile(jsonFilePath, "utf-8");
    const universities = (JSON.parse(json) as any[])
      .map(normalizeJsonToUniversity)
      .filter(Boolean) as University[];
    return universities;
  } catch (error) {
    console.error("Failed to load universities:", error);
    return [];
  }
}
