import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const rawUrl = process.env.SUPABASE_URL || '';
const rawAnon = process.env.SUPABASE_ANON_KEY || '';
const rawService = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseUrl = rawUrl && !rawUrl.includes('your-project-id') ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = rawAnon && !rawAnon.includes('your-anon-key') ? rawAnon : 'placeholder-anon-key';
const supabaseServiceRoleKey = rawService && !rawService.includes('your-service-role-key') ? rawService : 'placeholder-service-role-key';

if (!rawUrl || rawUrl.includes('your-project-id')) {
  console.warn('Backend running in demo fallback mode: Supabase environment variables are unset or placeholders.');
}

// Client for standard public actions
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Stateless API requests
  },
});

// Client for administrative actions (requires service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
