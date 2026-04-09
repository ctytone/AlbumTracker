import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function AlbumCard({
  id,
  name,
  artist,
  coverUrl,
  rating,
  status,
}: {
  id: string;
  name: string;
  artist: string;
  coverUrl: string | null;
  rating: number | null;
  status: string | null;
}) {
  return (
    <Link href={`/app/albums/${id}`}>
      <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="p-0">
          <div className="aspect-square w-full bg-muted/60">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={name}
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="space-y-2 p-4">
            <p className="line-clamp-1 text-sm font-medium">{name}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground">{artist}</p>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span>
                {rating === null ? "Not listened" : `${rating.toFixed(2)} avg`}
              </span>
              {status ? <Badge variant="secondary">{status.replaceAll("_", " ")}</Badge> : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
