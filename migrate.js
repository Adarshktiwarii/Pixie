const { Client } = require('pg');

const connectionString = 'postgresql://postgres:HmYu1US6XRNltdD3@db.ibruffhhtkewildogqiy.supabase.co:5432/postgres';

const migrationSQL = `
-- Add blood_group to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS blood_group TEXT;

-- 9. Insurance Table
CREATE TABLE IF NOT EXISTS insurance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  policy_number TEXT,
  valid_until TEXT,
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE insurance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own insurance" ON insurance;
CREATE POLICY "Users can manage own insurance" ON insurance FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 10. Travel Logs Table
CREATE TABLE IF NOT EXISTS travel_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE travel_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own travel logs" ON travel_logs;
CREATE POLICY "Users can manage own travel logs" ON travel_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 11. Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  reg_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own registrations" ON registrations;
CREATE POLICY "Users can manage own registrations" ON registrations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Update Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE insurance;
ALTER PUBLICATION supabase_realtime ADD TABLE travel_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE registrations;
`;

async function runMigration() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to Supabase. Running migrations...");
    await client.query(migrationSQL);
    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration error:", err.message);
  } finally {
    await client.end();
  }
}

runMigration();
