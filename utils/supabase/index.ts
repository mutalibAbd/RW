/**
 * Supabase Utilities - Barrel Export
 * 
 * Re-exports all Supabase client utilities for convenient imports.
 */

// Client-side exports
export { getSupabaseClient, createSupabaseClient } from './client';

// Server-side exports
export { createSupabaseServerClient, createSupabaseAdminClient } from './server';
