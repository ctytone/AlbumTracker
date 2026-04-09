import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getEnv } from "@/lib/env";

export async function GET() {
  const env = getEnv();
  const state = crypto.randomUUID();
  const cookieStore = await cookies();

  cookieStore.set("spotify_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  });

  const url = new URL("https://accounts.spotify.com/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", env.SPOTIFY_CLIENT_ID);
  url.searchParams.set("scope", "user-library-read user-read-email user-read-private");
  url.searchParams.set("redirect_uri", env.SPOTIFY_REDIRECT_URI);
  url.searchParams.set("state", state);
  url.searchParams.set("show_dialog", "true");

  return NextResponse.redirect(url.toString());
}
