import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Verify() {
  const router = useRouter();
  const { phone } = useLocalSearchParams(); // GET phone from previous screen

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function verifyOTP() {
    if (!phone) {
      alert("Missing phone number.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      phone: phone.toString(),
      token: otp,
      type: "sms",
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.replace("/"); // Success
  }

  return (
    <View className="flex-1 justify-center px-5 bg-white">
      <Text className="text-2xl font-bold mb-4">Enter OTP</Text>

      <Text className="text-gray-600 mb-2">
        Sent to <Text className="font-bold">{phone}</Text>
      </Text>

      <TextInput
        placeholder="OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
      />

      <TouchableOpacity
        onPress={verifyOTP}
        disabled={loading}
        className="bg-black rounded-lg py-3 items-center"
      >
        <Text className="text-white font-semibold">
          {loading ? "Verifying..." : "Verify & Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}