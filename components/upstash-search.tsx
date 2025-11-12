"use client";

import { SearchBar } from "@upstash/search-ui";
import "@upstash/search-ui/dist/index.css";

import { Search } from "@upstash/search";
import { FileText } from "lucide-react";

const client = new Search({
  url: process.env.NEXT_PUBLIC_UPSTASH_SEARCH_REST_URL!,
  token: process.env.NEXT_PUBLIC_UPSTASH_SEARCH_REST_TOKEN_READONLY!,
});

// 👇 your search index name
const index = client.index<{ title: string }>("movies");

export default function Page() {
  return (
    <div className="max-w-sm mt-24 mx-auto">
      <SearchBar.Dialog>
        <SearchBar.DialogTrigger placeholder="Search movies..." />

        <SearchBar.DialogContent>
          <SearchBar.Input placeholder="Type to search movies..." />
          <SearchBar.Results
            searchFn={(query) => {
              // 👇 100% type-safe: whatever you return here is
              // automatically typed as `result` below
              return index.search({ query, limit: 10, reranking: true });
            }}
          >
            {(result) => (
              <SearchBar.Result value={result.id} key={result.id}>
                <SearchBar.ResultIcon>
                  <FileText className="text-gray-600" />
                </SearchBar.ResultIcon>

                <SearchBar.ResultContent>
                  <SearchBar.ResultTitle>
                    {result.content.title}
                  </SearchBar.ResultTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Movie</p>
                </SearchBar.ResultContent>
              </SearchBar.Result>
            )}
          </SearchBar.Results>
        </SearchBar.DialogContent>
      </SearchBar.Dialog>
    </div>
  );
}
