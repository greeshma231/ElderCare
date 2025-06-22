/*
  # Fix duplicate policy issue

  This migration ensures the user profile creation policy exists without causing errors
  if it already exists.

  1. Security
    - Drop existing policy if it exists
    - Create the policy for user profile creation during signup
*/

-- Drop the policy if it already exists to avoid conflicts
DROP POLICY IF EXISTS "Allow user profile creation during signup" ON users;

-- Allow users to insert their own profile data during signup
CREATE POLICY "Allow user profile creation during signup"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);