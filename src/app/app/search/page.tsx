import { SearchClient } from "@/features/search/search-client";

export default function SearchPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-heading text-3xl">Search</h1>
        <p className="text-sm text-muted-foreground">
          Search Spotify and add albums manually even when your Spotify library is not synced.
        </p>
      </div>
      <SearchClient />
    </section>
  );
}
