import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./supabase";

/**
 * Browser Supabase client for the admin dashboard.
 * Sessions persist in localStorage and refresh automatically. All data
 * access is enforced by row-level security — the anon key alone can never
 * read messages, subscribers, or donations; an allowlisted admin login can.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
