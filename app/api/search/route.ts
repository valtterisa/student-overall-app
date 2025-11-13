import { Search } from "@upstash/search";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_UPSTASH_SEARCH_REST_URL;
    const token = process.env.UPSTASH_SEARCH_REST_TOKEN;

    if (!url || !token) {
      return NextResponse.json(
        { success: false, error: "Missing Upstash credentials" },
        { status: 500 }
      );
    }

    const { query } = (await req.json()) as { query: string };

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const search = new Search({ url, token });
    const index = search.index("haalarikone-db");

    const results = await index.search({
      query: query.trim(),
      reranking: true,
      limit: 100,
    });

    return NextResponse.json({ results: results || [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
