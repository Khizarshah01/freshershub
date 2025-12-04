import { supabase } from "@/lib/supabase";
import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function sendOTP() {
    if (phone.length !== 10) {
      alert("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    const fullPhone = "+91" + phone;

    const { error } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    // Move to OTP screen WITH phone param
    router.push({
      pathname: "/auth/verify",
      params: { phone: fullPhone },
    } as unknown as Href);
  }

  return (
    <View className="flex-1 justify-center px-5 bg-white">
      <Text className="text-2xl font-bold mb-4">Login with Phone</Text>

      <TextInput
        placeholder="Phone (10 digits)"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
      />

      <TouchableOpacity
        onPress={sendOTP}
        disabled={loading}
        className="bg-black rounded-lg py-3 items-center"
      >
        <Text className="text-white font-semibold">
          {loading ? "Sending..." : "Send OTP"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}