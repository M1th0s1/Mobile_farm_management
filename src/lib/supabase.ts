import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Je Supabase nakonfigurované? (bez .env apka beží na mock dátach) */
export const isSupabaseConfigured = Boolean(url && anonKey);

/** Vypnutie prihlasovania (VITE_AUTH_DISABLED=true) – apka beží na mock dátach */
export const authDisabled = import.meta.env.VITE_AUTH_DISABLED === "true";

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null;
