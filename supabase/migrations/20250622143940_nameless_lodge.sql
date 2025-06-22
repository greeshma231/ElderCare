/*
  # Allow user registration for anonymous users

  1. Security Changes
    - Add RLS policy to allow anonymous users to insert new user records during registration
    - This enables the sign-up functionality while maintaining security for other operations

  2. Policy Details
    - Allow INSERT operations for anonymous (anon) role
    - Only applies to user registration, existing policies for authenticated users remain unchanged
*/

-- Allow anonymous users to insert new user records during registration
CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);