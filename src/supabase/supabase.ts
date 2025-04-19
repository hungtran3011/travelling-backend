import { createClient } from '@supabase/supabase-js';
import { Database } from './schema';
import { config } from 'dotenv';

config();

const url = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient<Database>(url, supabaseKey, {
    auth: {
        flowType: 'pkce',
    },
});

export const supabaseService = createClient<Database>(url, supabaseServiceKey, {
    auth: {
        flowType: 'pkce',
    },
});