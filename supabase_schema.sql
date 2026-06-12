-- Pixie Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT,
  microchip TEXT,
  reg TEXT,
  dob DATE,
  gender TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2. Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  color TEXT,
  attachments INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own events" ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON events FOR DELETE USING (auth.uid() = user_id);

-- 3. Vaccinations Table
CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  next_due TEXT,
  status TEXT,
  vet TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own vaccinations" ON vaccinations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Deworming Table
CREATE TABLE deworming (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product TEXT NOT NULL,
  date TEXT NOT NULL,
  next_due TEXT,
  status TEXT,
  weight TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE deworming ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own deworming" ON deworming FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. Medications Table
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dose TEXT,
  frequency TEXT,
  condition TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own medications" ON medications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. Growth Logs Table
CREATE TABLE growth_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE growth_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own growth logs" ON growth_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 7. Memories Table
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  date TEXT NOT NULL,
  age TEXT,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own memories" ON memories FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 8. Documents Table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  type TEXT,
  size TEXT,
  date TEXT,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own documents" ON documents FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Storage Buckets Setup
INSERT INTO storage.buckets (id, name, public) VALUES ('pixie_files', 'pixie_files', true) ON CONFLICT DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Users can upload their own files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'pixie_files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'pixie_files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'pixie_files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Files are publicly accessible" ON storage.objects FOR SELECT TO public USING (bucket_id = 'pixie_files');
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
