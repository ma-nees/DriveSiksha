import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('your-project-id')
  ? import.meta.env.VITE_SUPABASE_URL
  : 'https://placeholder.supabase.co';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY && !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your-anon-key')
  ? import.meta.env.VITE_SUPABASE_ANON_KEY
  : 'placeholder-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('your-project-id')) {
  console.warn(
    'Supabase environment variables are missing! Using mock demo fallback. Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to connect to live Supabase.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
