/**
 * Database Type Definitions for Zero-Cost Gallery
 * Generated from: supabase/schema.sql
 * 
 * This file provides TypeScript types that mirror the Supabase database schema.
 * It enables type-safe database operations with Supabase client.
 * 
 * Usage:
 * ```typescript
 * import { Database } from '@/types/database.types';
 * import { createClient } from '@supabase/supabase-js';
 * 
 * const supabase = createClient<Database>(url, key);
 * const { data } = await supabase.from('products').select('*');
 * // `data` is now typed as Product[]
 * ```
 */

// ============================================================================
// JSON Types (for JSONB columns)
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ============================================================================
// Product Metadata Schema
// ============================================================================

export interface ProductMetadata {
  license?: string;       // e.g., "CC0", "Public Domain"
  artist?: string;        // Artist name or "Unknown"
  source?: string;        // Source URL (Poly Pizza, Sketchfab, etc.)
  tags?: string[];        // e.g., ["furniture", "chair", "minimalist"]
  [key: string]: Json | undefined; // Allow additional fields
}

// ============================================================================
// Database Schema
// ============================================================================

export interface Database {
  public: {
    Tables: {
      // ======================================================================
      // Table: system_health
      // ======================================================================
      system_health: {
        Row: {
          id: string;                // UUID
          last_check: string;        // TIMESTAMPTZ (ISO 8601 string)
          status: string;            // e.g., "healthy", "degraded"
          created_at: string;        // TIMESTAMPTZ (ISO 8601 string)
        };
        Insert: {
          id?: string;               // Optional (auto-generated UUID)
          last_check?: string;       // Optional (defaults to NOW())
          status?: string;           // Optional (defaults to "healthy")
          created_at?: string;       // Optional (defaults to NOW())
        };
        Update: {
          id?: string;
          last_check?: string;
          status?: string;
          created_at?: string;
        };
      };

      // ======================================================================
      // Table: products
      // ======================================================================
      products: {
        Row: {
          id: string;                // UUID
          name: string;              // Product name
          description: string | null; // Product description (optional)
          glb_url: string;           // URL to GLB file
          poster_url: string | null; // URL to poster image (WebP/AVIF)
          file_size_bytes: number;   // File size in bytes (must be < 5MB)
          draco_compressed: boolean; // Whether Draco compression is applied
          metadata: ProductMetadata; // JSONB metadata (license, tags, etc.)
          created_at: string;        // TIMESTAMPTZ (ISO 8601 string)
          updated_at: string;        // TIMESTAMPTZ (ISO 8601 string)
        };
        Insert: {
          id?: string;               // Optional (auto-generated UUID)
          name: string;
          description?: string | null;
          glb_url: string;
          poster_url?: string | null;
          file_size_bytes: number;
          draco_compressed?: boolean; // Optional (defaults to true)
          metadata?: ProductMetadata; // Optional (defaults to {})
          created_at?: string;       // Optional (defaults to NOW())
          updated_at?: string;       // Optional (defaults to NOW())
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          glb_url?: string;
          poster_url?: string | null;
          file_size_bytes?: number;
          draco_compressed?: boolean;
          metadata?: ProductMetadata;
          created_at?: string;
          updated_at?: string;
        };
      };
    };

    // ========================================================================
    // Views (none currently defined)
    // ========================================================================
    Views: {
      [_ in never]: never;
    };

    // ========================================================================
    // Functions (none currently defined for direct invocation)
    // ========================================================================
    Functions: {
      [_ in never]: never;
    };

    // ========================================================================
    // Enums (none currently defined)
    // ========================================================================
    Enums: {
      [_ in never]: never;
    };
  };
}

// ============================================================================
// Helper Types for Type-Safe Queries
// ============================================================================

/**
 * Type for a single product row (as returned from SELECT)
 */
export type Product = Database['public']['Tables']['products']['Row'];

/**
 * Type for inserting a new product
 */
export type ProductInsert = Database['public']['Tables']['products']['Insert'];

/**
 * Type for updating a product
 */
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

/**
 * Type for a single system_health row
 */
export type SystemHealth = Database['public']['Tables']['system_health']['Row'];

/**
 * Type for inserting a system_health record
 */
export type SystemHealthInsert = Database['public']['Tables']['system_health']['Insert'];

/**
 * Type for updating a system_health record
 */
export type SystemHealthUpdate = Database['public']['Tables']['system_health']['Update'];

// ============================================================================
// Validation Constants
// ============================================================================

/**
 * Maximum file size for products (5MB in bytes)
 * Enforced at application layer (not database constraint)
 */
export const MAX_PRODUCT_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Recommended file size for products (2MB in bytes)
 */
export const RECOMMENDED_PRODUCT_FILE_SIZE = 2 * 1024 * 1024; // 2MB
