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
import { getUniqueFields } from "@/lib/get-unique-values";
import { generateSlug } from "@/lib/generate-slug";

export const revalidate = 3600;

export default async function FieldIndexPage() {
  const universities = await loadUniversities();
  const fields = getUniqueFields(universities).sort((a, b) =>
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
            <BreadcrumbPage>Alat</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-4xl font-bold mb-4">Kaikki alat</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Valitse ala nähdäksesi siihen liittyvät haalarit eri oppilaitoksissa.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {fields.map((field) => (
          <Link
            key={field}
            href={`/ala/${generateSlug(field)}`}
            className="rounded-lg border px-4 py-3 font-medium text-green hover:bg-green/5"
          >
            {field}
          </Link>
        ))}
      </div>
    </div>
  );
}

