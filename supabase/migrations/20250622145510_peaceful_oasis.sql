/*
  # Create demo user for ElderCare app

  1. Demo User
    - Creates a demo user account for testing
    - Username: shelly
    - Full name: Shelly Thompson
    - Age: 72, Female
    - Primary caregiver: Sarah Johnson

  2. Security
    - Uses proper UUID for user ID
    - Follows existing RLS policies
*/

-- Insert demo user if it doesn't exist
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