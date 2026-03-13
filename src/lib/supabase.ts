import { createClient } from "@supabase/supabase-js";

const supabseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;


if ( ! supabseAnonKey || !supabseUrl){
    throw new Error("Missing Supabse Environment");
}

export const supabase = createClient(supabseUrl,supabseAnonKey);