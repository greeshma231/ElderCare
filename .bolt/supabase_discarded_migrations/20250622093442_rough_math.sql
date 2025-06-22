/*
  # Fix user signup RLS policy

  1. Security Changes
    - Add policy to allow users to insert their own profile during signup
    - This allows the signup process to work properly while maintaining security
*/

-- Allow users to insert their own profile data during signup
CREATE POLICY "Allow user profile creation during signup"
  ON users
  FOR INSERT
  TO authenticated
  USING (auth.uid() = id);