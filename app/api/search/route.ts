import { Search } from "@upstash/search";

const client = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN,
});

const index = client.index("my-index");

export async function POST(req: Request) {
  const { query } = (await req.json()) as { query: string };

  const results = await index.search({ query });

  return new Response(JSON.stringify(results));
}
