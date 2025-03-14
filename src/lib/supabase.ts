
import { createClient } from '@supabase/supabase-js';

// Create a temporary mock client for development
// This will be replaced with real credentials when connecting to Supabase
const supabaseUrl = 'https://example.supabase.co';
const supabaseKey = 'mock-key-for-development';

export const supabase = createClient(supabaseUrl, supabaseKey);
