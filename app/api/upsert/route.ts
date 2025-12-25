import { Search } from "@upstash/search";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { enrichDocumentWithTranslations } from "@/lib/enrich-search-data";

export async function POST() {
  try {
    const url = process.env.UPSTASH_SEARCH_REST_URL;
    const token = process.env.UPSTASH_SEARCH_REST_TOKEN;
    if (!url || !token) {
      return NextResponse.json(
        { success: false, error: "Missing Upstash credentials" },
        { status: 500 }
      );
    }
    const search = new Search({ url, token });
    const index = search.index("haalarikone-db");
    const filePath = path.join(process.cwd(), "data", "overall_colors_upstash.json");
    const fileContents = await readFile(filePath, "utf-8");
    type Document = {
      id: string;
      content: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    };
    const documents = JSON.parse(fileContents) as Document[];
    if (!Array.isArray(documents)) {
      return NextResponse.json(
        { success: false, error: "Parsed JSON is not an array" },
        { status: 400 }
      );
    }
    const enrichedDocuments = await Promise.all(
      documents.map(enrichDocumentWithTranslations)
    );
    const batchSize = 100;
    let uploaded = 0;
    for (let i = 0; i < enrichedDocuments.length; i += batchSize) {
      const batch = enrichedDocuments.slice(i, i + batchSize);
      await index.upsert(batch);
      uploaded += batch.length;
    }
    return NextResponse.json({
      success: true,
      count: uploaded,
      batches: Math.ceil(uploaded / batchSize),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
