export const itemStatuses = ["want_to_listen", "currently_listening", "rated"] as const;

export const itemTypeValues = ["album", "track", "artist"] as const;

export type ItemStatus = (typeof itemStatuses)[number];
export type ItemType = (typeof itemTypeValues)[number];
