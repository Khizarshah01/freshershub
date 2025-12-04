import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { Platform } from "react-native";

const extra = Constants.expoConfig?.extra as
  | {
      EXPO_PUBLIC_SUPABASE_URL?: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
    }
  | undefined;

const supabaseUrl = extra?.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key must be defined in app.json extra.");
}

// Use AsyncStorage only on native. On web, let Supabase use its own storage (localStorage),
// which avoids the "window is not defined" error during SSR / web bundling.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === "web" ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
