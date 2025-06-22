/*
  # Fix Authentication Policies

  1. Security
    - Drop all existing conflicting policies
    - Create proper RLS policies for user registration and access
    - Ensure authenticated users can insert their own profile after signup
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable user registration" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create policies that work with the auth flow

-- Allow authenticated users to insert their own profile (critical for signup)
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to read their own profile
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure demo user exists for testing
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
) ON CONFLICT (username) DO NOTHING;