import { z } from "zod";

const imageSchema = z.object({
  url: z.string().url(),
  height: z.number().nullable(),
  width: z.number().nullable(),
});

const artistSchema = z.object({
  id: z.string(),
  name: z.string(),
  popularity: z.number().optional(),
  genres: z.array(z.string()).optional(),
  images: z.array(imageSchema).optional(),
});

const simplifiedArtistSchema = artistSchema.pick({
  id: true,
  name: true,
});

const simplifiedAlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  album_type: z.string(),
  release_date: z.string(),
  total_tracks: z.number(),
  images: z.array(imageSchema),
  external_urls: z.object({
    spotify: z.string().url().nullable().optional(),
  }),
  artists: z.array(simplifiedArtistSchema),
});

export const searchResponseSchema = z.object({
  albums: z
    .object({
      items: z.array(simplifiedAlbumSchema),
    })
    .optional(),
  tracks: z
    .object({
      items: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          duration_ms: z.number(),
          explicit: z.boolean(),
          track_number: z.number(),
          disc_number: z.number(),
          preview_url: z.string().nullable(),
          artists: z.array(simplifiedArtistSchema),
          album: simplifiedAlbumSchema,
        }),
      ),
    })
    .optional(),
  artists: z
    .object({
      items: z.array(artistSchema),
    })
    .optional(),
});

export const albumDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  album_type: z.string(),
  release_date: z.string(),
  popularity: z.number().optional(),
  images: z.array(imageSchema),
  external_urls: z.object({
    spotify: z.string().url().nullable().optional(),
  }),
  artists: z.array(simplifiedArtistSchema),
  tracks: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        duration_ms: z.number(),
        explicit: z.boolean(),
        track_number: z.number(),
        disc_number: z.number(),
        preview_url: z.string().nullable(),
        artists: z.array(simplifiedArtistSchema),
      }),
    ),
  }),
});

export const savedAlbumsSchema = z.object({
  items: z.array(
    z.object({
      added_at: z.string(),
      album: simplifiedAlbumSchema,
    }),
  ),
  next: z.string().url().nullable(),
});
