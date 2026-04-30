import { AlbumCard } from "@/components/album-card";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/server/auth";

type AlbumRelation =
  | {
      id: string;
      name: string;
      release_date: string | null;
      cover_url: string | null;
      artists: { name: string } | Array<{ name: string }> | null;
    }
  | Array<{
      id: string;
      name: string;
      release_date: string | null;
      cover_url: string | null;
      artists: { name: string } | Array<{ name: string }> | null;
    }>
  | null;

function pickAlbum(albumRelation: AlbumRelation) {
  if (!albumRelation) {
    return null;
  }

  return Array.isArray(albumRelation) ? albumRelation[0] ?? null : albumRelation;
}

function pickArtistName(artistRelation: { name: string } | Array<{ name: string }> | null) {
  if (!artistRelation) {
    return "";
  }

  if (Array.isArray(artistRelation)) {
    return artistRelation[0]?.name ?? "";
  }

  return artistRelation.name;
}

export default async function AlbumsPage({
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { supabase, user } = await requireUser();

  let query = supabase
    .from("user_albums")
    .select(
      `
      export default async function AlbumsPage() {
        id,
        name,
        release_date,
        cover_url,
        artists:primary_artist_id (name)
      )
    `,
    )
    .eq("user_id", user.id);

  query = query.order("updated_at", { ascending: false });

  console.log("[Albums page] User ID:", user.id);
  const { data: rows, error } = await query;
  console.log("[Albums page] Query result:", { rowCount: rows?.length, error, sample: rows?.[0] });

  // Fetch item statuses separately since there's no direct FK relationship
  const albumIds = (rows ?? []).map((row) => row.album_id);
  const { data: itemStatuses } = await supabase
    .select("item_id,status")
    .eq("item_type", "album")
    .in("item_id", albumIds.length > 0 ? albumIds : ["00000000-0000-0000-0000-000000000000"]);

  const statusMap = new Map(itemStatuses?.map((s) => [s.item_id, s]) ?? []);
  const albums = rows ?? [];

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl">Your albums</h1>
          <p className="text-sm text-muted-foreground">Your synced Spotify library and manually added albums.</p>
        </div>
        <Badge variant="outline">{albums.length} albums</Badge>
      </div>

      {albums.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {albums.map((row) => {
            const album = pickAlbum(row.albums as AlbumRelation);
            const status = statusMap.get(row.album_id)?.status ?? null;

            return (
              <AlbumCard
                key={row.album_id}
                id={row.album_id}
                name={album?.name ?? "Unknown album"}
                artist={pickArtistName(album?.artists ?? null) || "Unknown artist"}
                coverUrl={album?.cover_url ?? null}
                rating={row.derived_rating ? Number(row.derived_rating) : null}
                status={status}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No albums yet"
          description="Sync your Spotify saved albums or search manually to start building your collection."
        />
      )}
    </section>
  );
}
