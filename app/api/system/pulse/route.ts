/**
 * Keep-Alive Pulse API Route
 * 
 * This endpoint is called by a scheduled GitHub Action every 48 hours
 * to prevent Supabase Free Tier from pausing due to inactivity.
 * 
 * Security:
 * - Protected by CRON_SECRET header verification
 * - Uses service role to bypass RLS for system_health table
 * 
 * Endpoint: POST /api/system/pulse
 * Headers: { "x-cron-secret": "<CRON_SECRET>" }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/utils/supabase/server';
import type { SystemHealth } from '@/types/database.types';

// Disable caching - this endpoint must always execute fresh
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /api/system/pulse
 * 
 * Updates the system_health table to keep the Supabase project active.
 */
export async function POST(request: NextRequest) {
  try {
    // =========================================================================
    // Step 1: Verify CRON_SECRET
    // =========================================================================
    const cronSecret = request.headers.get('x-cron-secret');
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret) {
      console.error('[Pulse] CRON_SECRET environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!cronSecret || cronSecret !== expectedSecret) {
      console.warn('[Pulse] Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // =========================================================================
    // Step 2: Update system_health table
    // =========================================================================
    const supabase = createSupabaseAdminClient();
    const now = new Date().toISOString();

    // Update the first (and only) row in system_health
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('system_health')
      .update({
        last_check: now,
        status: 'healthy',
      })
      .select()
      .single() as { data: SystemHealth | null; error: { message: string } | null };

    if (error) {
      console.error('[Pulse] Database error:', error.message);
      return NextResponse.json(
        { error: 'Database update failed', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No system health record found' },
        { status: 404 }
      );
    }

    // =========================================================================
    // Step 3: Return success response
    // =========================================================================
    console.log('[Pulse] System health updated:', now);

    return NextResponse.json({
      success: true,
      message: 'System pulse recorded',
      timestamp: now,
      data: {
        id: data.id,
        last_check: data.last_check,
        status: data.status,
      },
    });
  } catch (error) {
    console.error('[Pulse] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/system/pulse
 * 
 * Returns the current system health status (public read).
 * Useful for status pages or monitoring.
 */
export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('system_health')
      .select('*')
      .single() as { data: SystemHealth | null; error: { message: string } | null };

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch system health', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No system health record found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: data.status,
      last_check: data.last_check,
      uptime: calculateUptime(data.created_at),
    });
  } catch (error) {
    console.error('[Pulse] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Calculate uptime since project creation
 */
function calculateUptime(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return `${diffDays}d ${diffHours}h`;
}
