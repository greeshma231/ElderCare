/*
  # Fix user registration RLS policies

  1. Policy Updates
    - Remove conflicting policies that prevent user registration
    - Add proper policy for anonymous user registration
    - Ensure authenticated users can manage their own profiles

  2. Security
    - Allow anonymous users to insert new user records during registration
    - Maintain security for authenticated user operations
*/

-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create new policies for proper user registration flow

-- Allow anonymous users to register (insert new users)
CREATE POLICY "Enable user registration"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read their own profile
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (id::text = auth.uid()::text);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id::text = auth.uid()::text)
  WITH CHECK (id::text = auth.uid()::text);

-- Allow authenticated users to insert their own profile (for edge cases)
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (id::text = auth.uid()::text);