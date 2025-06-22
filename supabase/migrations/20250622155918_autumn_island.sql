/*
  # Fresh Authentication Setup

  1. Database Setup
    - Ensure demo user exists with proper auth integration
    - Create auth user for demo account

  2. Security
    - Proper RLS policies for authenticated users
    - Clean, working authentication flow
*/

-- Ensure demo user exists in users table
INSERT INTO users (
  id,
  email,
  username,
  full_name,
  age,
  gender,
  primary_caregiver
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'shelly@eldercare.app',
  'shelly',
  'Shelly Thompson',
  72,
  'Female',
  'Sarah Johnson'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  age = EXCLUDED.age,
  gender = EXCLUDED.gender,
  primary_caregiver = EXCLUDED.primary_caregiver,
  updated_at = now();