import { createClient } from '@supabase/supabase-js';
import { Database } from './schema';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';

config();

const url = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Check if environment variables are properly set
if (!url || !supabaseKey || !supabaseServiceKey) {
  Logger.error("Missing Supabase environment variables:");
  Logger.error(`SUPABASE_URL: ${url ? "Set" : "Missing"}`);
  Logger.error(`SUPABASE_ANON_KEY: ${supabaseKey ? "Set" : "Missing"}`);
  Logger.error(`SUPABASE_SERVICE_KEY: ${supabaseServiceKey ? "Set" : "Missing"}`);
  throw new Error("Missing required Supabase environment variables");
}

Logger.log("Initializing Supabase clients...");

export const supabase = createClient<Database>(url, supabaseKey, {
    auth: { flowType: 'pkce' },
});

export const supabaseService = createClient<Database>(url, supabaseServiceKey, {
    auth: { flowType: 'pkce' },
});

Logger.log("Supabase clients initialized");