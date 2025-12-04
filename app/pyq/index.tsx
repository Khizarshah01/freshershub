import { supabase } from "@/lib/supabase";
import { Link, Stack, useLocalSearchParams, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import rightArrow from "../../assets/images/right-arrow.png";

type Pack = {
  id: string;
  title: string;
  branch: string;
  subjectsCount: number;
  subtitle: string;
  price: string;
  type: string; // pyq | model | answers (DB-controlled)
  color: string;
};

function getColor(branch: string) {
  switch (branch) {
    case "Computer Science":
      return "bg-indigo-100 text-indigo-700";
    case "Mechanical Engg":
      return "bg-orange-100 text-orange-700";
    case "Civil Engg":
      return "bg-emerald-100 text-emerald-700";
    case "Information Technology":
      return "bg-teal-100 text-teal-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function Marketplace() {
  const { filter } = useLocalSearchParams();
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  const activeFilter =
    filter === "model" ? "model" : "pyq";

  // ------------------------------
  // Fetch Packs from Supabase
  // ------------------------------
  useEffect(() => {
    fetchPacks();
  }, []);

  async function fetchPacks() {
    const { data, error } = await supabase.from("packs").select("*");

    if (error) {
      console.log("PACK FETCH ERROR:", error);
      return;
    }

    if (!data) return;

    const formatted = data.map((p) => ({
      id: p.id,
      title: p.title,
      branch: p.branch,
      subjectsCount: p.subjects_count,
      subtitle: p.subtitle,
      price: `₹${p.price}`,
      type: p.type,
      color: getColor(p.branch),
    }));

    setPacks(formatted);
    setLoading(false);
  }

  const filtered = packs.filter((p) => p.type === activeFilter);

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Browse Packs",
          headerStyle: { backgroundColor: "#F8F9FC" },
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "800", fontSize: 18 },
        }}
      />

      <SafeAreaView className="flex-1 bg-[#F8F9FC]" edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false} className="p-5 pt-2">

          {/* Search Bar */}
          <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-6 shadow-sm">
            <Text className="text-gray-400 mr-2">🔍</Text>
            <TextInput
              placeholder="Search 'CSE 4th Sem'..."
              className="flex-1 font-medium text-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Filter Pills */}
          <View className="flex-row mb-6">
            <Link href={"/pyq?filter=pyq" as Href} asChild>
              <TouchableOpacity
                className={`mr-3 px-5 py-2.5 rounded-full border ${
                  activeFilter === "pyq"
                    ? "bg-black border-black"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`font-bold text-xs ${
                    activeFilter === "pyq" ? "text-white" : "text-gray-600"
                  }`}
                >
                  Question Papers
                </Text>
              </TouchableOpacity>
            </Link>

            <Link href={"/pyq?filter=model" as Href} asChild>
              <TouchableOpacity
                className={`px-5 py-2.5 rounded-full border ${
                  activeFilter === "model"
                    ? "bg-black border-black"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`font-bold text-xs ${
                    activeFilter === "model" ? "text-white" : "text-gray-600"
                  }`}
                >
                  Model Answers
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Packs Header */}
          <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">
            Available Semesters ({filtered.length})
          </Text>

          {/* Show Loading State */}
          {loading && (
            <Text className="text-center text-gray-500 py-6">
              Loading packs...
            </Text>
          )}

          {!loading &&
            filtered.map((pack) => (
              <Link key={pack.id} href={`/pyq/${pack.id}/preview` as Href} asChild>
                <TouchableOpacity className="bg-white p-5 rounded-[24px] mb-4 border border-gray-100 shadow-sm">
                  
                  {/* Row 1: Branch + Price */}
                  <View className="flex-row justify-between items-start mb-3">
                    <View className={`px-3 py-1 rounded-lg ${pack.color.split(" ")[0]}`}>
                      <Text className={`text-[10px] font-extrabold uppercase tracking-wide ${pack.color.split(" ")[1]}`}>
                        {pack.branch}
                      </Text>
                    </View>

                    <View className="bg-gray-900 px-3 py-1.5 rounded-full">
                      <Text className="text-white font-bold text-xs">
                        {pack.price}
                      </Text>
                    </View>
                  </View>

                  {/* Row 2: Title + Subtitle */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-4">
                      <Text className="text-xl font-extrabold text-gray-900 leading-6 mb-1">
                        {pack.title}
                      </Text>

                      <Text className="text-gray-500 text-xs leading-4" numberOfLines={2}>
                        Includes{" "}
                        <Text className="font-bold text-gray-800">
                          {pack.subjectsCount} Subjects
                        </Text>
                        : {pack.subtitle}
                      </Text>
                    </View>

                    <View className="h-10 w-10 bg-gray-50 rounded-full border border-gray-100 items-center justify-center">
                      <Image source={rightArrow} className="w-10 h-4" resizeMode="contain" />
                    </View>
                  </View>

                </TouchableOpacity>
              </Link>
            ))}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <Text className="text-center text-gray-500 mt-6">
              No packs found for this filter.
            </Text>
          )}

          <View className="items-center mt-4">
            <Text className="text-gray-400 text-xs font-medium">
              More semesters coming soon 🚀
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
