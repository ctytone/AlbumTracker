import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/server/auth";

function pickNameRelation(
  relation: { name: string } | Array<{ name: string }> | null | undefined,
  fallback: string,
) {
  if (!relation) {
    return fallback;
  }

  if (Array.isArray(relation)) {
    return relation[0]?.name ?? fallback;
  }

  return relation.name;
}

export default async function StatsPage() {
  const { supabase, user } = await requireUser();

  const [{ data: ratings }, { data: topAlbums }, { data: topArtists }, { count: totalTracks }] =
    await Promise.all([
      supabase.from("song_ratings").select("rating").eq("user_id", user.id),
      supabase
        .from("user_albums")
        .select("derived_rating,albums!inner(name)")
        .eq("user_id", user.id)
        .not("derived_rating", "is", null)
        .order("derived_rating", { ascending: false })
        .limit(5),
      supabase
        .from("song_ratings")
        .select("rating,tracks!inner(artists:primary_artist_id(name))")
        .eq("user_id", user.id),
      supabase
        .from("album_tracks")
        .select("track_id", { count: "exact", head: true }),
    ]);

  const distribution = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((bucket) => ({
    bucket,
    count: (ratings ?? []).filter((row) => Number(row.rating) === bucket).length,
  }));

  const artistAverageMap = new Map<string, { total: number; count: number }>();
  for (const row of topArtists ?? []) {
    const trackRelation = row.tracks as
      | { artists: { name: string } | Array<{ name: string }> | null }
      | Array<{ artists: { name: string } | Array<{ name: string }> | null }>
      | null;

    const track = Array.isArray(trackRelation) ? trackRelation[0] ?? null : trackRelation;
    const artistName = pickNameRelation(track?.artists, "Unknown artist");
    const current = artistAverageMap.get(artistName) ?? { total: 0, count: 0 };
    current.total += Number(row.rating);
    current.count += 1;
    artistAverageMap.set(artistName, current);
  }

  const rankedArtists = [...artistAverageMap.entries()]
    .map(([name, metrics]) => ({
      name,
      average: metrics.total / metrics.count,
    }))
    .sort((a, b) => b.average - a.average)
    .slice(0, 5);

  const listenedTracks = ratings?.length ?? 0;
  const progress = totalTracks ? Math.round((listenedTracks / totalTracks) * 100) : 0;

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-heading text-3xl">Stats</h1>
        <p className="text-sm text-muted-foreground">
          Rating distribution, top albums, top artists, and listening progress.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Listening progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>{progress}% of indexed tracks rated</p>
            <p>
              {listenedTracks}/{totalTracks ?? 0} tracks rated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {distribution.map((entry) => (
              <div key={entry.bucket} className="flex items-center justify-between">
                <span>{entry.bucket.toFixed(1)} stars</span>
                <span className="text-muted-foreground">{entry.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top albums</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {(topAlbums ?? []).map((album, index) => {
              const albumName = pickNameRelation(
                album.albums as { name: string } | Array<{ name: string }> | null,
                "Unknown album",
              );

              return (
              <div key={`${albumName}-${index}`} className="flex items-center justify-between">
                <span>
                  {albumName}
                </span>
                <span className="text-muted-foreground">{Number(album.derived_rating).toFixed(2)}</span>
              </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top artists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {rankedArtists.map((artist) => (
              <div key={artist.name} className="flex items-center justify-between">
                <span>{artist.name}</span>
                <span className="text-muted-foreground">{artist.average.toFixed(2)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
