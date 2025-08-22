// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://khihrrhozlwpoedggnfp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoaWhycmhvemx3cG9lZGdnbmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNzcxMjcsImV4cCI6MjA3MDY1MzEyN30.eI0Xu95ZZ3Chs4OLkUycREXjgQG-C3D5xj5yQp_J2r8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
