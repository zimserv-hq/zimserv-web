// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("DEBUG VITE_SUPABASE_URL:", supabaseUrl);
console.log(
  "DEBUG VITE_SUPABASE_ANON_KEY prefix:",
  supabaseAnonKey ? supabaseAnonKey.slice(0, 12) : "MISSING",
);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
