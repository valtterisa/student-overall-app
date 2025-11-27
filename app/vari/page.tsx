import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { loadUniversities } from "@/lib/load-universities";
import { getUniqueColors } from "@/lib/get-unique-values";
import { generateSlug } from "@/lib/generate-slug";

export const revalidate = 3600;

export default async function ColorIndexPage() {
  const universities = await loadUniversities();
  const colors = getUniqueColors(universities).sort((a, b) =>
    a.localeCompare(b, "fi")
  );

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Etusivu</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Värit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-4xl font-bold mb-4">Kaikki värit</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Valitse väri nähdäksesi kaikki siihen liittyvät haalarit ja oppilaitokset.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {colors.map((color) => (
          <Link
            key={color}
            href={`/vari/${generateSlug(color)}`}
            className="rounded-lg border px-4 py-3 font-medium text-green hover:bg-green/5"
          >
            {color}
          </Link>
        ))}
      </div>
    </div>
  );
}

