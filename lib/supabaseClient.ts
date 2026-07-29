"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./supabase";

/**
 * Browser Supabase client — used only by the admin area.
 *
 * Auth is magic-link: Don or Patti type their email, tap the link in their
 * inbox, and they are signed in on that phone until they sign out. No password
 * to remember, nothing to write on a sticky note.
 *
 * The publishable key here is safe in the browser by design; every table is
 * protected by row level security, and only emails listed in `site_authors`
 * can write anything.
 */
let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!client) {
    client = createClient(supabaseConfig.url, supabaseConfig.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

/** Public URL for a file in the mission-photos bucket. */
export function storageUrl(path: string) {
  return `${supabaseConfig.url}/storage/v1/object/public/mission-photos/${path}`;
}

/** Turn a title into a URL slug. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}
