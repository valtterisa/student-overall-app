import { Search } from "@upstash/search";

const client = new Search({
  url: "https://crack-swan-56660-eu1-search.upstash.io",
  token: "********",
});

const index = client.index("movies");

await index.upsert([
  {
    id: "star-wars",
    content: {
      title: "Star Wars: Episode IV, A New Hope",
      genre: "sci-fi",
    },
    metadata: {
      summary:
        "A long time ago in a distant galaxy, a rebellion rises against an oppressive empire.",
    },
  },
]);
