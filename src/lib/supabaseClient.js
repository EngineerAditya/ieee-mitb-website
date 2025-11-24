/**
 * Supabase Client Configuration
 * 
 * This file sets up the connection to Supabase - our backend database.
 * 
 * What is Supabase?
 * - Open-source Firebase alternative
 * - PostgreSQL database with real-time capabilities
 * - Provides authentication, storage, and database in one platform
 * - No need for a separate backend server
 * 
 * How it works:
 * 1. Creates a client instance with project URL and anonymous key
 * 2. Client can be imported in any component to fetch/update data
 * 3. Anonymous key is safe to expose (access controlled by Row Level Security policies)
 * 
 * Database Schema:
 * The 'events' table stores all IEEE events with fields:
 * - id: Unique identifier (UUID)
 * - title: Event name
 * - date: Event date/time (timestamp)
 * - location: Event venue
 * - description: Event details
 * - image_url: Event poster/image URL
 * - society: Organizing IEEE society
 * - created_at: Record creation time
 * 
 * Usage Example:
 * ```javascript
 * import { supabase } from './lib/supabaseClient';
 * 
 * // Fetch all events
 * const { data, error } = await supabase
 *   .from('events')
 *   .select('*')
 *   .order('date', { ascending: false });
 * 
 * // Filter by society
 * const { data } = await supabase
 *   .from('events')
 *   .select('*')
 *   .eq('society', 'Computer Society');
 * ```
 * 
 * Security Note:
 * The SUPABASE_ANON_KEY is intentionally exposed in client-side code.
 * Supabase uses Row Level Security (RLS) policies to control data access.
 * For production, consider using environment variables:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 */

// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Supabase project configuration
const SUPABASE_URL = "https://khihrrhozlwpoedggnfp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoaWhycmhvemx3cG9lZGdnbmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNzcxMjcsImV4cCI6MjA3MDY1MzEyN30.eI0Xu95ZZ3Chs4OLkUycREXjgQG-C3D5xj5yQp_J2r8";

// Create and export the Supabase client
// This single instance is reused across the entire application
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
