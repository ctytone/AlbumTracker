import { NextResponse } from "next/server";

import { searchSchema } from "@/lib/schemas";
import { searchResponseSchema } from "@/lib/spotify/schemas";
import { spotifyFetch } from "@/lib/spotify/client";
import { getSpotifyAppAccessToken } from "@/lib/spotify/app-token";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsedQuery = searchSchema.safeParse({
    query: searchParams.get("query") ?? "",
    type: searchParams.get("type") ?? "album",
    limit: searchParams.get("limit") ?? "20",
  });

  if (!parsedQuery.success) {
    return NextResponse.json({ error: "Invalid query." }, { status: 400 });
  }

  try {
    const token = await getSpotifyAppAccessToken();
    const data = await spotifyFetch(
      `/search?q=${encodeURIComponent(parsedQuery.data.query)}&type=${parsedQuery.data.type}&limit=${parsedQuery.data.limit}`,
      token,
      searchResponseSchema,
    );

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Spotify search failed.",
      },
      { status: 502 },
    );
  }
}
