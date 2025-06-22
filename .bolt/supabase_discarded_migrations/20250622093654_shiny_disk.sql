-- Allow users to insert their own profile data during signup
CREATE POLICY "Allow user profile creation during signup"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);