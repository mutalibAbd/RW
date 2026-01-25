# Supabase Setup Guide: Applying the SQL Schema

This guide walks you through setting up your Supabase database for the Zero-Cost Gallery project using the Supabase Dashboard.

## Prerequisites

- A Supabase account (free tier)
- Your Supabase project created at [app.supabase.com](https://app.supabase.com)

---

## Step 1: Access the SQL Editor

1. Log in to your Supabase Dashboard: https://app.supabase.com
2. Select your project from the list
3. In the left sidebar, navigate to **SQL Editor** (icon looks like `</>`).

---

## Step 2: Run the Schema Migration

### Option A: Copy-Paste the Entire Schema (Recommended)

1. Open the file `supabase/schema.sql` in this repository
2. Copy the **entire contents** of the file (all 200+ lines)
3. In the Supabase SQL Editor:
   - Click **"New query"**
   - Paste the entire schema into the editor
   - Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)

4. **Expected Result**:
   - You should see a success message: `Success. No rows returned`
   - This is normal (DDL statements don't return rows)

### Option B: Run Schema in Sections (For Learning)

If you want to understand each part, run the schema in these sections:

#### Section 1: Create Tables
```sql
-- Run lines 17-51 (system_health table)
-- Then run lines 53-98 (products table)
```

#### Section 2: Enable RLS
```sql
-- Run lines 100-142 (RLS policies)
```

#### Section 3: Create Functions & Triggers
```sql
-- Run lines 144-167 (updated_at trigger)
```

---

## Step 3: Verify the Schema

After running the migration, verify that the tables were created:

### Check Tables
1. In the left sidebar, click **Table Editor**
2. You should see two tables:
   - `system_health`
   - `products`

### Check RLS Policies
1. Click on the `products` table
2. In the top navigation, click the **shield icon** (RLS)
3. You should see policies like:
   - "Allow public read on products"
   - "Allow authenticated insert on products"
   - etc.

### Check Triggers
1. In the SQL Editor, run this query to verify the trigger:
   ```sql
   SELECT trigger_name, event_manipulation, event_object_table
   FROM information_schema.triggers
   WHERE event_object_table = 'products';
   ```
2. You should see: `set_updated_at | UPDATE | products`

---

## Step 4: Get Your Supabase Credentials

You'll need these for your Next.js app:

### Get Project URL and Anon Key

1. In the left sidebar, click **Settings** (gear icon)
2. Click **API**
3. Copy the following:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1...`

4. Add these to your `.env.local` file in your Next.js project:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
   ```

### Get Service Role Key (For Keep-Alive API)

**⚠️ SECURITY WARNING**: The service role key bypasses RLS. Never expose it to the client!

1. In **Settings** → **API**, scroll down to **Service role**
2. Click **"Reveal"** and copy the key
3. Add to `.env.local` (this will be used by `/api/system/pulse`):
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1...
   ```

---

## Step 5: Test the Database

### Insert a Test Product

Run this SQL in the SQL Editor to insert a sample product:

```sql
INSERT INTO public.products (name, description, glb_url, poster_url, file_size_bytes, metadata)
VALUES (
  'Test Chair',
  'A test product for WebAR gallery',
  'https://example.com/chair.glb',
  'https://example.com/chair.webp',
  1048576, -- 1MB
  '{"license": "CC0", "artist": "Test Artist", "tags": ["furniture", "test"]}'::jsonb
);
```

### Query the Test Product

```sql
SELECT * FROM public.products;
```

You should see your test product returned.

### Test the Keep-Alive Table

```sql
SELECT * FROM public.system_health;
```

You should see one row with `status = 'healthy'`.

---

## Step 6: Clean Up Test Data (Optional)

If you want to remove the test product:

```sql
DELETE FROM public.products WHERE name = 'Test Chair';
```

---

## Common Issues & Troubleshooting

### Issue: "permission denied for table products"

**Solution**: RLS is enabled. Make sure you're authenticated or using the correct policies.
- For testing, you can temporarily disable RLS:
  ```sql
  ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
  ```
  **⚠️ Remember to re-enable it before production!**

### Issue: "function gen_random_uuid() does not exist"

**Solution**: Supabase enables this by default, but if it fails:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Issue: Schema runs but tables don't appear

**Solution**: Check that you're in the `public` schema:
1. In Table Editor, click the schema dropdown (top left)
2. Select `public`

---

## Next Steps

1. **Connect Next.js App**: Use the Supabase URL and anon key in your app
2. **Set Up Keep-Alive**: Create the `/api/system/pulse` route (Backend Agent)
3. **Create GitHub Action**: Schedule the cron job to ping `/api/system/pulse` every 48 hours
4. **Add Products**: Start uploading 3D models to your gallery!

---

## Architecture Notes (for the Architect Agent)

### RLS Philosophy: "Deny All, Whitelist Specific"

- **Public**: Can READ products and system_health
- **Authenticated**: Can INSERT, UPDATE, DELETE products
- **Service Role**: Can UPDATE system_health (for Keep-Alive)

### Keep-Alive Strategy

The `system_health` table is updated by the `/api/system/pulse` endpoint. This ensures:
1. Supabase sees "database activity" every 48 hours
2. The project never pauses (avoids 7-day inactivity timeout)
3. No manual intervention required

### Free Tier Compliance

- **Max DB Size**: 500MB (enforced via file size limits in app logic)
- **Max Connections**: Limited (use connection pooling in Supabase client)
- **Pausing**: Prevented via Keep-Alive mechanism

---

**End of Setup Guide**
