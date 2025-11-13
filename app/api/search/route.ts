import { Search } from "@upstash/search";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_UPSTASH_SEARCH_REST_URL;
  const token = process.env.UPSTASH_SEARCH_REST_TOKEN;

  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(15, "10 s"),
  });

  const identifier = token!; // Rate limit by token I don't know is it good idea
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return "Unable to process at this time";
  }

  if (!url || !token) {
    return NextResponse.json(
      { success: false, error: "Wrong credentials" },
      { status: 401 }
    );
  }

  const body = (await req.json()) as {
    query: string;
    filter?: string | Record<string, unknown>;
  };

  const { query, filter } = body;

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const search = new Search({ url, token });
  const index = search.index("haalarikone-db");

  const searchParams: Parameters<typeof index.search>[0] = {
    query: query.trim(),
    reranking: true,
    limit: 20,
  };

  if (filter) {
    searchParams.filter = filter as any;
  }

  const results = await index.search(searchParams);

  return NextResponse.json({ results: results || [] });
}
