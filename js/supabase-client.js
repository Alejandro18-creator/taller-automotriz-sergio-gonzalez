export function getSupabaseClient() {
  if (window.supabaseClient) {
    return window.supabaseClient;
  }

  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_KEY;

  if (
    window.supabase &&
    typeof window.supabase.createClient === "function" &&
    url &&
    key
  ) {
    window.supabaseClient = window.supabase.createClient(url, key);
    return window.supabaseClient;
  }

  return null;
}
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://ocqvpbwqovxprigfwqcc.supabase.co";
const supabaseKey = "sb_publishable_5LJ8bhujNmgyTRin-gc-ig_X4968E_B";

export const supabase = createClient(supabaseUrl, supabaseKey);
