// Simple types for the app - no actual Supabase connection needed for now
export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  primary_caregiver?: string;
  created_at?: string;
  updated_at?: string;
}

// Placeholder - not actually used in the simple auth system
export const supabase = null;