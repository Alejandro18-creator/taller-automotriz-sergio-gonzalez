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
