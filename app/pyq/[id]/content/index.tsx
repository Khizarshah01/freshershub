import { supabase } from "@/lib/supabase";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ContentIndexScreen() {
  const params = useLocalSearchParams() as { id?: string; sessionId?: string };
  const packId = params.id;
  const sessionId = params.sessionId;

  const [loading, setLoading] = useState(true);
  const [paper, setPaper] = useState<any>(null);
  const [allowed, setAllowed] = useState(false);
  const [openRepeatedIndex, setOpenRepeatedIndex] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("Exam Mate");


  useEffect(() => {
    if (packId && sessionId) init();
  }, [packId, sessionId]);

  async function init() {
    setLoading(true);

    try {
      // Check user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace("/auth/login");

      // Check purchase
      const { data: purchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("pack_id", packId)
        .maybeSingle();

      if (!purchase) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      setAllowed(true);

      const { data: profile } = await supabase
        .from("profiles")
        .select("phone")
        .eq("id", user.id)
        .single();

      setWatermarkText(
        profile?.phone
          ? `${profile.phone}`
          : "Exam Mate Premium User"
      );

      // Load content
      const { data } = await supabase
        .from("session_contents")
        .select("content")
        .eq("session_id", Number(sessionId))
        .maybeSingle();

      const parsed =
        typeof data?.content === "string"
          ? JSON.parse(data.content)
          : data?.content;

      setPaper(parsed);
    } catch (err) {
      console.log("Error:", err);
    }

    setLoading(false);
  }

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );

  if (!allowed)
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-xl font-bold mb-2">Access Denied</Text>
        <Text className="text-gray-500 text-center">
          Purchase the pack to view content.
        </Text>
      </View>
    );

  if (!paper)
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No content found.</Text>
      </View>
    );

  const toRoman = (num: number) => {
    const romans = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
    return romans[num - 1] || num.toString();
  };

  // 🔥 MAIN A4-STYLE RENDER STARTS HERE
  return (
    <>
      <Stack.Screen
        options={{
          title: paper.subject?.name + " " + paper?.session || "paper",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#F8F9FC" },
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "800", fontSize: 18 },
        }}
      />
      <ScrollView className="flex-1 bg-white"
  contentContainerStyle={{ 
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  }}>
    <View className="w-full max-w-2xl self-center">
        {/* HEADER */}
        <Text className="text-center text-2xl font-extrabold text-red-700 tracking-wide mt-2">
          Sant Gadge Baba Amravati University
        </Text>

        <Text className="text-center text-lg font-semibold text-gray-700 mb-5 mt-1">
          {paper.session} Examination
        </Text>

        {/* Subject Row */}
        <View className="flex-row justify-between items-center mb-6 px-1">
          <Text className="text-[15px] text-gray-900">
            <Text className="font-bold">Subject:</Text> {paper.subject.name} ({paper.subject.code})
          </Text>

          <Text className="text-[15px] text-gray-900">
            <Text className="font-bold">Max Marks:</Text> {paper.subject.max_marks}
          </Text>
        </View>

        {/* UNITS */}
        {paper.units?.map((unit: any, i: number) => (
          <View key={i} className="mb-6">
            <Text className="text-2xl text-center font-bold mb-3 mt-8 text-red-600">
              Unit {unit.unit_no}: {unit.unit_title}
            </Text>

            {/* OPTIONS */}
            {unit.options?.map((opt: any, oi: number) => (
              <View key={oi} className="pl-2">
                {oi > 0 && (
                  <Text className="italic text-red-500 text-center font-bold my-3">OR</Text>
                )}

                {/* QUESTIONS */}
                {opt.questions?.map((q: any, qi: number) => {
                  const questionUniqueId = `${i}-${oi}-${qi}`;
                  return (
                    <View key={qi} className="mb-3">
                      {/* Question Row */}
                      <View className="flex-row justify-between">
                        <Text className="text-[17px] text-gray-900 leading-6 flex-1 mr-2">
                          <Text className="font-extrabold text-gray-800">
                            {(() => {
                              if (opt.questions.length === 1) return `Q${opt.option_no})`;
                              const letter = String.fromCharCode(97 + qi);
                              return qi === 0 ? `Q${opt.option_no}.${letter}` : letter + ')';
                            })()}
                          </Text>{" "}
                          {q.question}
                        </Text>

                        <Text className="text-gray-900 font-bold text-[16px] mt-1">({q.marks} marks)</Text>
                      </View>

                      {/* SUBQUESTIONS */}
                      {q.subquestions?.length > 0 && (
                        <View className="ml-6 mt-2">
                          {q.subquestions.map((sub: any, si: number) => (
                            <View key={si} className="flex-row justify-between mb-1">
                              <Text className="text-[16px] text-gray-900 leading-6 flex-1 mr-2">
                                <Text className="font-extrabold text-gray-800">
                                  {q.numberingType === "numeric" ? `${si + 1})` : `${toRoman(si + 1)})`}
                                </Text>{" "}
                                {sub.text}
                              </Text>
                              <Text className="text-gray-900 text-[12px] mt-1">({sub.marks} marks)</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      <View className="flex-row flex-wrap items-start mt-2">
                        {q.repeated_in?.length > 0 && (
                          <View className="mt-1">
                            <TouchableOpacity
                              onPress={() => {
                                setOpenRepeatedIndex(prev =>
                                  prev === questionUniqueId ? null : questionUniqueId
                                );
                              }}
                              className="bg-yellow-100 px-4 py-2 rounded-full flex-row items-center"
                            >
                              <Text className="text-yellow-800 font-bold text-xs">
                                Repeated {q.repeated_in.length}x
                              </Text>
                            </TouchableOpacity>

                            {/* SHOW LIST ONLY FOR THIS QUESTION */}
                            {openRepeatedIndex === questionUniqueId && (
                              <View className="mt-2 ml-4 bg-yellow-50 p-3 rounded-lg border border-yellow-300">
                                {q.repeated_in.map((yr: string, idx: number) => (
                                  <Text key={idx} className="text-yellow-900 text-sm mb-1">
                                    • Asked in {yr}
                                  </Text>
                                ))}
                              </View>
                            )}
                          </View>
                        )}

                        {/* YouTube links */}
                        {q.youtube_links?.length > 0 && (
                          <View className="ml-1 mt-2 flex-row flex-wrap">

                            {q.youtube_links.map((yt: any, yti: number) => (
                              <TouchableOpacity
                                key={yti}
                                onPress={() => Linking.openURL(yt.url)}
                                className="flex-row items-center bg-red-100 px-3 py-1 rounded-full mr-2 mb-2"
                              >
                                {/* YouTube icon circle */}
                                <AntDesign name="youtube" size={14} color="#e11d48" />

                                {/* Title */}
                                {/* <Text className="text-[9px] text-red-700 font-semibold">
                              {yt.title || "Watch explanation"}
                            </Text> */}
                              </TouchableOpacity>
                            ))}

                          </View>
                        )}
                      </View>
                      {/* Images */}
                      {q.images?.length > 0 && (
                        <View className="ml-3 mt-2">
                          {q.images.map((img: any, imi: number) => (
                            <Image
                              key={imi}
                              source={{ uri: img.url }}
                              className="w-40 h-40 border mb-2"
                              resizeMode="contain"
                            />
                          ))}
                        </View>
                      )}
                    </View>
                  )
                })}
              </View>
            ))}
            <View className="absolute inset-x-0 top-1/2 -translate-y-1/2 items-center pointer-events-none -z-10">
      <Text className="text-gray-400 text-7xl font-black opacity-15 -rotate-12 tracking-widest">
        {watermarkText}
      </Text>
    </View>
          </View>
        ))}
        {/* <View className="absolute inset-0 items-center justify-center pointer-events-none">
          <Text className="text-gray-400 text-7xl font-black opacity-10 -rotate-45 tracking-widest">
            {watermarkText}
          </Text>
        </View> */}
        <View className="absolute bottom-1 left-0 right-0 items-center pointer-events-none">
          <Text className="text-gray-500 text-sm font-bold opacity-60">
            {watermarkText} • © Exam Mate 2025
          </Text>
        </View>
        </View>
      </ScrollView>
    </>
  );
}