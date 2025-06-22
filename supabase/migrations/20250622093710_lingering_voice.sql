-- Allow users to insert their own profile data during signup
-- Drop the policy if it exists and recreate it to ensure it's correct
DROP POLICY IF EXISTS "Allow user profile creation during signup" ON users;

CREATE POLICY "Allow user profile creation during signup"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);