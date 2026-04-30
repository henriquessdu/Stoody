import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY?.trim();

const looksLikePlaceholder = (value) =>
  !value ||
  value.includes("your-project") ||
  value.includes("your-anon-key") ||
  value.includes("replace") ||
  value.includes("example");

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  !looksLikePlaceholder(supabaseUrl) &&
  !looksLikePlaceholder(supabaseAnonKey)
);

if (!isSupabaseConfigured) {
  console.error(
    "[Supabase] Configuração inválida. Verifique REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY em .env"
  );
  if (supabaseUrl && !supabaseUrl.startsWith("http")) {
    console.error("[Supabase] REACT_APP_SUPABASE_URL deve começar com http:// ou https://", supabaseUrl);
  }
  if (looksLikePlaceholder(supabaseUrl)) {
    console.error("[Supabase] REACT_APP_SUPABASE_URL parece ser um placeholder e deve ser substituído.", supabaseUrl);
  }
  if (looksLikePlaceholder(supabaseAnonKey)) {
    console.error("[Supabase] REACT_APP_SUPABASE_ANON_KEY parece ser um placeholder e deve ser substituído.", supabaseAnonKey);
  }
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
});