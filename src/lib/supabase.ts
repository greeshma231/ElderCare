import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  username: string;
  full_name: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  primary_caregiver?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  mood: 'happy' | 'neutral' | 'sad';
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'mitra';
  message_text: string;
  has_audio: boolean;
  created_at: string;
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dose: string;
  time_scheduled: string;
  frequency: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  user_id: string;
  taken_at?: string;
  status: 'taken' | 'missed' | 'skipped';
  notes?: string;
  marked_by: string;
  created_at: string;
}

export interface Caregiver {
  id: string;
  user_id: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
  address?: string;
  specialty?: string;
  category: 'family' | 'medical' | 'professional' | 'friend';
  is_primary: boolean;
  is_emergency_contact: boolean;
  notes?: string;
  created_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: 'happy' | 'okay' | 'neutral' | 'sad' | 'upset';
  note?: string;
  voice_note_url?: string;
  images?: string[];
  entry_date: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  voice_note_url?: string;
  images?: string[];
  entry_date: string;
  created_at: string;
}