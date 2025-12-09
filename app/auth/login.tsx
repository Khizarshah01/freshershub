import { supabase } from "@/lib/supabase";
import { useRouter, type Href } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import exammate from "../../assets/images/ExamMate.png";

export default function Login() {
  const [mode, setMode] = useState<"phone" | "email">("phone");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
  
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  
  /* -------------------------------
      PHONE OTP LOGIN
  --------------------------------*/
  async function sendPhoneOTP() {
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

  /* -------------------------------
      EMAIL LOGIN (email + password)
  --------------------------------*/
  async function loginWithEmail() {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.replace("/");
  }

  /* -------------------------------
      EMAIL SIGN-UP (for testing)
  --------------------------------*/
  async function signupEmail() {
    if (!email || !password) return alert("Enter email and password");

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) return alert(error.message);

    alert("Account created! Please Login.");
  }

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    className="flex-1 bg-[#F8F9FC]"
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

<View
  className={`px-6 py-10 ${keyboardVisible ? "" : "flex-1 justify-center"}`}
>

      {/* Header */}
      <View className="items-center mb-10">
        <View className="w-16 h-16 bg-black/90 items-center justify-center">
          <Image source={exammate} className="w-15 h-14" resizeMode="contain" />
        </View>
        <Text className="text-gray-800 text-xl font-extrabold mt-3">Exam Mate</Text>
        <Text className="text-gray-500 text-sm mt-1">Your university journey starts here</Text>
      </View>

      {/* Card */}
      <View className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">

        {/* MODE SWITCHER */}
        <View className="flex-row justify-center mb-4">
          <TouchableOpacity
            onPress={() => setMode("phone")}
            className={`px-4 py-2 rounded-l-xl border ${mode === "phone" ? "bg-black" : "bg-gray-200"}`}
          >
            <Text className={`${mode === "phone" ? "text-white" : "text-black"}`}>Phone</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode("email")}
            className={`px-4 py-2 rounded-r-xl border ${mode === "email" ? "bg-black" : "bg-gray-200"}`}
          >
            <Text className={`${mode === "email" ? "text-white" : "text-black"}`}>Email</Text>
          </TouchableOpacity>
        </View>

        {/* PHONE LOGIN UI */}
        {mode === "phone" && (
          <>
            <Text className="text-gray-500 text-sm mb-4">Enter your phone number</Text>

            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5">
              <Text className="text-gray-700 font-semibold mr-2">+91</Text>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                className="flex-1 text-gray-800 font-medium"
              />
            </View>

            <TouchableOpacity
              onPress={sendPhoneOTP}
              disabled={loading}
              className={`py-3 rounded-xl items-center ${
                loading ? "bg-gray-300" : "bg-black active:bg-gray-800"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* EMAIL LOGIN UI */}
        {mode === "email" && (
          <>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              className="border rounded-xl px-4 py-3 mb-3 border-gray-200  bg-gray-50 text-black"
              keyboardType="email-address"
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="border rounded-xl px-4 py-3 mb-5 border-gray-200  bg-gray-50 text-black"
            />

            <TouchableOpacity
              onPress={loginWithEmail}
              disabled={loading}
              className={`py-3 rounded-xl items-center ${
                loading ? "bg-gray-300" : "bg-black"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Login</Text>
              )}
            </TouchableOpacity>

            {/* SIGNUP for testing only */}
            <TouchableOpacity
              onPress={() => router.push("/auth/signup")}
              className="mt-3"
            >
              <Text className="text-center text-indigo-600 font-semibold">Create Account</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}