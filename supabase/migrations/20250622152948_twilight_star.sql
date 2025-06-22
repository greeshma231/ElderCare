/*
  # Ensure demo user exists and is properly set up

  1. Demo User Setup
    - Creates the demo user 'shelly' if it doesn't exist
    - Ensures proper UUID and data structure
    - Safe to run multiple times

  2. Security
    - Uses proper RLS policies
    - Maintains data integrity
*/

-- First, ensure we have the demo user in the users table
INSERT INTO users (
  id,
  username,
  password_hash,
  full_name,
  age,
  gender,
  primary_caregiver
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'shelly',
  'demo_password_hash',
  'Shelly Thompson',
  72,
  'Female',
  'Sarah Johnson'
) ON CONFLICT (username) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  age = EXCLUDED.age,
  gender = EXCLUDED.gender,
  primary_caregiver = EXCLUDED.primary_caregiver,
  updated_at = now();

-- Ensure RLS policies are correct
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create clean, working policies
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);