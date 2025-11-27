import Link from "next/link";
import { generateSlug } from "@/lib/generate-slug";
import type { University } from "@/types/university";
import {
  getUniqueUniversities,
  getUniqueFields,
  getUniqueColors,
  getUniqueAreas,
} from "@/lib/get-unique-values";

interface BrowseSectionProps {
  universities: University[];
}

export default function BrowseSection({ universities }: BrowseSectionProps) {
  const uniqueUniversities = getUniqueUniversities(universities);
  const uniqueFields = getUniqueFields(universities);
  const uniqueColors = getUniqueColors(universities);
  const uniqueAreas = getUniqueAreas(universities);

  const popularUniversities = uniqueUniversities.slice(0, 8);
  const popularFields = uniqueFields.slice(0, 8);
  const popularColors = uniqueColors.slice(0, 6);
  const popularAreas = uniqueAreas.slice(0, 6);

  return (
    <div className="w-full max-w-6xl px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        Selaa haalarivärejä
      </h2>
      <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
        Tutustu haalariväreihin selaamalla yliopistoa, alaa, väriä tai aluetta.
        Voit myös käyttää hakua löytääksesi tarkemmat tiedot.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Yliopistot ja AMK:t</h3>
          <div className="flex flex-wrap gap-2">
            {popularUniversities.map((uni) => (
              <Link
                key={uni}
                href={`/oppilaitos/${generateSlug(uni)}`}
                className="px-4 py-2 bg-green/10 text-green rounded hover:bg-green/20 transition text-sm"
              >
                {uni}
              </Link>
            ))}
          </div>
          {uniqueUniversities.length > popularUniversities.length && (
            <p className="text-sm text-gray-600 mt-4">
              + {uniqueUniversities.length - popularUniversities.length} muuta
              oppilaitosta
            </p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Alat</h3>
          <div className="flex flex-wrap gap-2">
            {popularFields.map((field) => (
              <Link
                key={field}
                href={`/ala/${generateSlug(field)}`}
                className="px-4 py-2 bg-green/10 text-green rounded hover:bg-green/20 transition text-sm"
              >
                {field}
              </Link>
            ))}
          </div>
          {uniqueFields.length > popularFields.length && (
            <p className="text-sm text-gray-600 mt-4">
              + {uniqueFields.length - popularFields.length} muuta alaa
            </p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Värit</h3>
          <div className="flex flex-wrap gap-2">
            {popularColors.map((color) => (
              <Link
                key={color}
                href={`/vari/${generateSlug(color)}`}
                className="px-4 py-2 bg-green/10 text-green rounded hover:bg-green/20 transition text-sm"
              >
                {color}
              </Link>
            ))}
          </div>
          {uniqueColors.length > popularColors.length && (
            <p className="text-sm text-gray-600 mt-4">
              + {uniqueColors.length - popularColors.length} muuta väriä
            </p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Alueet</h3>
          <div className="flex flex-wrap gap-2">
            {popularAreas.map((area) => (
              <Link
                key={area}
                href={`/alue/${generateSlug(area)}`}
                className="px-4 py-2 bg-green/10 text-green rounded hover:bg-green/20 transition text-sm"
              >
                {area}
              </Link>
            ))}
          </div>
          {uniqueAreas.length > popularAreas.length && (
            <p className="text-sm text-gray-600 mt-4">
              + {uniqueAreas.length - popularAreas.length} muuta aluetta
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
