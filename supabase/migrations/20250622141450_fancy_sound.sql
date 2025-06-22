/*
  ElderCare Database Setup
  
  Run this SQL in your Supabase SQL Editor to create all necessary tables
  and set up Row Level Security (RLS) policies.
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  age integer,
  gender text CHECK (gender IN ('Male', 'Female', 'Other')),
  primary_caregiver text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  mood text DEFAULT 'neutral' CHECK (mood IN ('happy', 'neutral', 'sad')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  sender text NOT NULL CHECK (sender IN ('user', 'mitra')),
  message_text text NOT NULL,
  has_audio boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  dose text NOT NULL,
  time_scheduled text NOT NULL,
  frequency text DEFAULT 'Daily',
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create medication_logs table
CREATE TABLE IF NOT EXISTS medication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id uuid REFERENCES medications(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  taken_at timestamptz,
  status text NOT NULL CHECK (status IN ('taken', 'missed', 'skipped')),
  notes text,
  marked_by text DEFAULT 'Self',
  created_at timestamptz DEFAULT now()
);

-- Create caregivers table
CREATE TABLE IF NOT EXISTS caregivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  relation text NOT NULL,
  phone text NOT NULL,
  email text,
  address text,
  specialty text,
  category text NOT NULL CHECK (category IN ('family', 'medical', 'professional', 'friend')),
  is_primary boolean DEFAULT false,
  is_emergency_contact boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  mood text NOT NULL CHECK (mood IN ('happy', 'okay', 'neutral', 'sad', 'upset')),
  note text,
  voice_note_url text,
  images text[],
  entry_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  voice_note_url text,
  images text[],
  entry_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policies for chat_sessions table
CREATE POLICY "Users can manage own chat sessions"
  ON chat_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for chat_messages table
CREATE POLICY "Users can manage own chat messages"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.session_id 
      AND auth.uid() = chat_sessions.user_id
    )
  );

-- Create policies for medications table
CREATE POLICY "Users can manage own medications"
  ON medications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for medication_logs table
CREATE POLICY "Users can manage own medication logs"
  ON medication_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for caregivers table
CREATE POLICY "Users can manage own caregivers"
  ON caregivers
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for mood_entries table
CREATE POLICY "Users can manage own mood entries"
  ON mood_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for journal_entries table
CREATE POLICY "Users can manage own journal entries"
  ON journal_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_medications_user_id ON medications(user_id);
CREATE INDEX IF NOT EXISTS idx_medications_active ON medications(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_medication_logs_user_id ON medication_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_medication_logs_date ON medication_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_caregivers_user_id ON caregivers(user_id);
CREATE INDEX IF NOT EXISTS idx_caregivers_primary ON caregivers(user_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_caregivers_emergency ON caregivers(user_id, is_emergency_contact);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date ON journal_entries(user_id, entry_date DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at 
  BEFORE UPDATE ON chat_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();