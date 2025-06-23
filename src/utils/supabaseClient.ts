import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabaseUrl: string = String(process.env.SUPABASE_URL);
const supabaseKey: string = String(process.env.SUPABASE_KEY);

export const supabase = createClient(supabaseUrl, supabaseKey);