/*
  # Fix Authentication Flow

  1. Security
    - Update RLS policies to work with proper Supabase auth flow
    - Ensure users can only access their own data
    - Allow authenticated users to insert their profile after auth signup

  2. Changes
    - Drop conflicting policies
    - Create proper policies for auth flow
    - Ensure auth.uid() matches user.id requirement
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable user registration" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create new policies that work with Supabase auth flow

-- Allow authenticated users to insert their own profile (after auth signup)
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