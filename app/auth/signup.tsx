"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created! Check your email to verify.");
    router.replace("/auth/login");
  }

  return (
    <View className="flex-1 bg-[#F8F9FC] px-6 py-10 justify-center">

      <Text className="text-3xl font-extrabold text-center mb-6">
        Create Account
      </Text>

      <View className="bg-white p-6 rounded-3xl shadow border">

        <TextInput
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          className="border p-3 rounded-xl mb-3 bg-gray-50 border-gray-200 text-black"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="border p-3 rounded-xl mb-5 bg-gray-50 border-gray-200 text-black"
        />

        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          className={`py-3 rounded-xl items-center ${
            loading ? "bg-gray-300" : "bg-black"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/login")} className="mt-4">
          <Text className="text-center text-indigo-600 font-semibold">
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}