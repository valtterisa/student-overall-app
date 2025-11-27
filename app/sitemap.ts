import { MetadataRoute } from "next";
import { loadUniversities } from "@/lib/load-universities";
import { loadBlogPosts } from "@/lib/load-blog-posts";
import {
  getUniqueUniversities,
  getUniqueFields,
  getUniqueColors,
  getUniqueAreas,
} from "@/lib/get-unique-values";
import { generateSlug } from "@/lib/generate-slug";
import { promises as fs } from "fs";
import path from "path";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://haalarikone.fi";
  const universities = await loadUniversities();
  const blogPosts = await loadBlogPosts();

  const jsonFilePath = path.join(
    process.cwd(),
    "data",
    "overall_colors_upstash.json"
  );

  let dataLastModified = new Date();
  try {
    const stats = await fs.stat(jsonFilePath);
    if (stats) {
      dataLastModified = stats.mtime;
    }
  } catch {}

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: dataLastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified:
        blogPosts.length > 0
          ? new Date(
              Math.max(
                ...blogPosts.map((p) => new Date(p.publishDate).getTime())
              )
            )
          : dataLastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const uniqueUniversities = getUniqueUniversities(universities);
  uniqueUniversities.forEach((uni) => {
    entries.push({
      url: `${baseUrl}/oppilaitos/${generateSlug(uni)}`,
      lastModified: dataLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  const uniqueFields = getUniqueFields(universities);
  uniqueFields.forEach((field) => {
    entries.push({
      url: `${baseUrl}/ala/${generateSlug(field)}`,
      lastModified: dataLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  const uniqueColors = getUniqueColors(universities);
  uniqueColors.forEach((color) => {
    entries.push({
      url: `${baseUrl}/vari/${generateSlug(color)}`,
      lastModified: dataLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  const uniqueAreas = getUniqueAreas(universities);
  uniqueAreas.forEach((area) => {
    entries.push({
      url: `${baseUrl}/alue/${generateSlug(area)}`,
      lastModified: dataLastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });

  universities.forEach((uni) => {
    entries.push({
      url: `${baseUrl}/haalari/${uni.id}`,
      lastModified: dataLastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  });

  blogPosts.forEach((post) => {
    entries.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishDate),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });

  return entries;
}
