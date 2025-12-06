import { supabase } from "@/lib/supabase";
import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import exammate from "../../assets/images/ExamMate.png";
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

    router.push({
      pathname: "/auth/verify",
      params: { phone: fullPhone },
    } as unknown as Href);
  }

  return (
    <View className="flex-1 bg-[#F8F9FC] px-6 py-10 justify-center">
      
      {/* 🔥 Logo / Branding */}
      <View className="items-center mb-10">
        <View className="w-16 h-16 bg-black/90 items-center justify-center">
        <Image source={exammate} className="w-15 h-14" resizeMode="contain" />
        </View>
        <Text className="text-gray-800 text-xl font-extrabold mt-3">Exam Mate</Text>
        <Text className="text-gray-500 text-sm mt-1">Your university journey starts here</Text>
      </View>

      {/* 🔥 Card */}
      <View className="bg-white p-6 rounded-3xl shadow-lg shadow-black/5 border border-gray-100">
        <Text className="text-2xl font-extrabold text-gray-900 mb-2">
          Login
        </Text>
        <Text className="text-gray-500 text-sm mb-5">
          Enter your phone number to receive an OTP
        </Text>

        {/* Phone Input */}
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5">
          <Text className="text-gray-700 font-semibold mr-2">+91</Text>
          <TextInput
            placeholder="Phone Number"
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            className="flex-1 text-gray-800 font-medium"
          />
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={sendOTP}
          disabled={loading}
          className={`py-3 rounded-xl items-center 
            ${loading ? "bg-gray-300" : "bg-black active:bg-gray-800"}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Send OTP</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 🔥 Footer */}
      <View className="items-center mt-8">
        <Text className="text-gray-400 text-xs font-medium">
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </View>
  );
}
