export type SpotifyImage = {
  url: string;
  height: number | null;
  width: number | null;
};

export type SpotifyArtist = {
  id: string;
  name: string;
  popularity?: number;
  genres?: string[];
  images?: SpotifyImage[];
};

export type SpotifyAlbum = {
  id: string;
  name: string;
  albumType: string;
  releaseDate: string;
  totalTracks: number;
  popularity?: number;
  imageUrl: string | null;
  spotifyUrl: string | null;
  artists: SpotifyArtist[];
};

export type SpotifyTrack = {
  id: string;
  name: string;
  durationMs: number;
  trackNumber: number;
  discNumber: number;
  explicit: boolean;
  previewUrl: string | null;
  artists: SpotifyArtist[];
};
