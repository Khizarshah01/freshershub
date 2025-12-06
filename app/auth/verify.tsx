import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Verify() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  // ⭐ The MAIN FIX
  const inputRef = useRef<TextInput>(null);

  // Timer
  useEffect(() => {
    if (timer === 0) return;
    const t = setInterval(() => setTimer((x) => x - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  function handlePressBox() {
    // ⭐ When user taps anywhere on the OTP UI → focus input
    inputRef.current?.focus();
  }

  async function verifyOTP() {
    if (otp.length < 6) {
      alert("Enter your 6-digit OTP");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      phone: phone?.toString(),
      token: otp,
      type: "sms",
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.replace("/");
  }

  async function resendOTP() {
    if (timer > 0) return;
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone?.toString(),
    });
    if (!error) setTimer(60);
  }

  return (
    <View className="flex-1 bg-[#F8F9FC] px-6 py-10 justify-center">

      <View className="items-center mb-10">
        <Text className="text-3xl font-extrabold text-gray-900">Verify OTP</Text>
        <Text className="text-gray-500 mt-2 text-sm">
          Sent to <Text className="font-semibold text-gray-700">{phone}</Text>
        </Text>
      </View>

      <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">

        <Text className="text-gray-700 font-medium text-sm mb-3">
          Enter the 6-digit code:
        </Text>

        {/* ⭐ Whole OTP box becomes tappable */}
        <Pressable onPress={handlePressBox} className="mb-6">
          <View className="flex-row justify-between">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                className={`w-12 h-12 rounded-xl bg-gray-50 border items-center justify-center 
                ${otp[i] ? "border-gray-700" : "border-gray-300"}`}
              >
                <Text className="text-xl font-bold text-gray-900">
                  {otp[i] ?? ""}
                </Text>
              </View>
            ))}
          </View>
        </Pressable>

        {/* ⭐ The REAL input (with full-screen hitbox) */}
        <TextInput
          ref={inputRef}
          autoFocus
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: 0, // invisible but ALWAYS touchable
          }}
        />

        <TouchableOpacity
          onPress={verifyOTP}
          disabled={loading}
          className={`py-3 rounded-xl items-center ${
            loading ? "bg-gray-300" : "bg-black active:bg-gray-800"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Verify & Continue
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={resendOTP}
          disabled={timer > 0}
          className="mt-4"
        >
          {timer > 0 ? (
            <Text className="text-center text-gray-400 font-medium">
              Resend OTP in {timer}s
            </Text>
          ) : (
            <Text className="text-center text-indigo-600 font-semibold">
              Resend OTP
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}