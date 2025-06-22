/*
  # Fix RLS policies for users table

  1. Security
    - Drop existing policies if they exist to avoid conflicts
    - Recreate comprehensive RLS policies for users table
    - Ensure users can manage their own profile data
    - Allow profile creation during signup process
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow user profile creation during signup" ON users;
DROP POLICY IF EXISTS "Allow user to read own profile" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create comprehensive RLS policies for users table
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

-- Allow public read access for emergency situations (optional, can be removed if not needed)
CREATE POLICY "Allow emergency profile access"
  ON users
  FOR SELECT
  TO public
  USING (false); -- This policy is disabled by default but can be enabled for emergency access