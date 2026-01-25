/**
 * Supabase Client Configuration
 * 
 * Uses Singleton pattern to prevent connection exhaustion in serverless environments.
 * This client is for CLIENT-SIDE usage only (respects RLS policies).
 * 
 * For server-side operations that need to bypass RLS, use server.ts instead.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

// Singleton instance
let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Get the Supabase client for browser/client-side usage.
 * Uses Singleton pattern to reuse the same client instance.
 * 
 * @returns Supabase client instance
 * 
 * @example
 * ```typescript
 * import { getSupabaseClient } from '@/utils/supabase/client';
 * 
 * const supabase = getSupabaseClient();
 * const { data } = await supabase.from('products').select('*');
 * ```
 */
export function getSupabaseClient() {
  if (client) {
    return client;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
    );
  }

  client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

  return client;
}

/**
 * Create a fresh Supabase client (for cases where singleton is not desired).
 * Use sparingly - prefer getSupabaseClient() for most cases.
 */
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
