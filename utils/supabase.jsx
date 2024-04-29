import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pyleapvvcehmbucjsbhe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bGVhcHZ2Y2VobWJ1Y2pzYmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyOTc2OTgsImV4cCI6MjAyOTg3MzY5OH0.gcd34ITrSnyGLoYZ9FdJGZbyyYy5rX_Bv9Vfrl7m4XM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  