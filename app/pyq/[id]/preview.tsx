import { Skeleton, SkeletonAccordion, SkeletonHeader } from "@/components/Skeleton";
import { supabase } from "@/lib/supabase";
import { Link, Stack, useLocalSearchParams, type Href } from "expo-router";
import { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Enable animations on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Pack = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: string;
  branch: string | null;
  subjects_count: number | null;
  subtitle: string | null;
};

type Subject = {
  id: string;
  pack_id: string;
  title: string;
  order_idx: number;
  sessions?: Session[];
};

type Session = {
  id: number;
  subject_id: string;
  slug: string;
  title: string;
  summary: string | null;
  created_at: string;
};

export default function Preview() {
  const { id } = useLocalSearchParams();

  const [pack, setPack] = useState<Pack | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Dummy syllabus (add DB later)
  const syllabus = [
    { name: "Official Syllabus 2025.pdf", type: "PDF" },
    { name: "University Pattern Guide.pdf", type: "PDF" },
  ];

  useEffect(() => {
    if (id) {
      fetchPackData();
    }
  }, [id]);

  async function fetchPackData() {
    setLoading(true);
  
    try {
      // 1️⃣ Fetch pack
      const { data: packData, error: packError } = await supabase
        .from("packs")
        .select("*")
        .eq("id", id)
        .single();
  
      if (packError) {
        console.error("Error fetching pack:", packError);
        return;
      }
  
      setPack(packData);
  
      // 2️⃣ Fetch subjects for this pack
      const { data: subjectsData, error: subjectsError } = await supabase
        .from("subjects")
        .select("*")
        .eq("pack_id", id)
        .order("order_idx", { ascending: true });
  
      if (subjectsError) {
        console.error("Error fetching subjects:", subjectsError);
        setSubjects([]);
        setLoading(false);
        return;
      }
  
      if (!subjectsData || subjectsData.length === 0) {
        setSubjects([]);
        setLoading(false);
        return;
      }
  
      // 3️⃣ Fetch sessions for these subjects
      const subjectIds = subjectsData.map((sub: Subject) => sub.id);
  
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select("*")
        .in("subject_id", subjectIds);
  
      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError);
      }
  
      // 4️⃣ Attach sessions to subjects
      const subjectsWithSessions = subjectsData.map((subject: Subject) => ({
        ...subject,
        sessions: sessionsData?.filter((session: Session) => 
          session.subject_id === subject.id
        ) || []
      }));
  
      setSubjects(subjectsWithSessions);
      
    } catch (error) {
      console.error("Unexpected error in fetchPackData:", error);
    } finally {
      setLoading(false);
    }
  }

  // Accordion state
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // Skeleton Loading Screen
  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Loading...",
            headerTintColor: "#000",
            headerStyle: { backgroundColor: "#F8F9FC" },
            headerShadowVisible: false,
            headerTitleStyle: { fontWeight: "800", fontSize: 18 },
          }}
        />
        
        <SafeAreaView className="flex-1 bg-[#F8F9FC]" edges={["bottom"]}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 120 }}
            className="p-5 pt-0"
            showsVerticalScrollIndicator={false}
          >
            {/* Header Skeleton */}
            <SkeletonHeader />

            {/* Free Access Section Skeleton */}
            <View className="mb-6">
              <Skeleton width={120} height={20} borderRadius={6} className="mb-3" />
              <View className="bg-white p-1 rounded-2xl border border-blue-100 shadow-sm">
                {[1, 2].map((i) => (
                  <View key={i} className="flex-row items-center p-4 bg-blue-50/50 rounded-xl mb-2">
                    <Skeleton width={24} height={24} borderRadius={12} className="mr-3" />
                    <View className="flex-1">
                      <Skeleton width="70%" height={18} borderRadius={6} className="mb-1" />
                      <Skeleton width={80} height={14} borderRadius={4} />
                    </View>
                    <Skeleton width={32} height={32} borderRadius={16} />
                  </View>
                ))}
              </View>
            </View>

            {/* Included Subjects Skeleton */}
            <View className="mb-3">
              <Skeleton width={150} height={20} borderRadius={6} className="mb-3" />
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonAccordion key={i} />
              ))}
            </View>
          </ScrollView>

          {/* Checkout Bar Skeleton */}
          <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-5 pb-8 rounded-t-[30px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <View className="flex-row items-center justify-between">
              <View>
                <Skeleton width={100} height={14} borderRadius={6} className="mb-2" />
                <View className="flex-row items-end">
                  <Skeleton width={80} height={32} borderRadius={8} />
                  <Skeleton width={40} height={18} borderRadius={6} className="ml-2 mb-1" />
                </View>
              </View>
              <Skeleton width={140} height={48} borderRadius={16} />
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (!pack) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8F9FC]" edges={["bottom"]}>
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-4xl mb-4">📦</Text>
          <Text className="text-xl font-bold text-gray-800 mb-2">Pack Not Found</Text>
          <Text className="text-gray-500 text-center mb-6">
            The pack you're looking for doesn't exist or has been removed.
          </Text>
          <TouchableOpacity 
            className="bg-black py-3 px-6 rounded-full"
            onPress={() => window.history.back()}
          >
            <Text className="text-white font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Pack Preview",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#F8F9FC" },
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "800", fontSize: 18 },
        }}
      />

      <SafeAreaView className="flex-1 bg-[#F8F9FC]" edges={["bottom"]}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          className="p-5 pt-0"
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View className="mb-6 mt-2">
            <View className="bg-black self-start px-3 py-1 rounded-full mb-3">
              <Text className="text-white font-bold text-[10px] uppercase tracking-wider">
                ⚡ Best Value Pack
              </Text>
            </View>

            <Text className="text-3xl font-extrabold text-gray-900 leading-9">
              {pack.title}
            </Text>

            <Text className="text-gray-500 font-medium mt-1">
              Contains {subjects.length} Subjects • {subjects.reduce((acc, s) => acc + (s.sessions?.length || 0), 0)} PDFs
            </Text>
          </View>

          {/* FREE SECTION */}
          <View className="mb-6">
            <Text className="text-gray-800 font-bold text-sm uppercase tracking-widest mb-3 opacity-70">
              Free Access 🔓
            </Text>

            <View className="bg-white p-1 rounded-2xl border border-blue-100 shadow-sm">
              {syllabus.map((file, i) => (
                <TouchableOpacity
                  key={i}
                  className="flex-row items-center p-4 bg-blue-50/50 rounded-xl active:bg-blue-100"
                >
                  <Text className="text-lg mr-3">📜</Text>

                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base">
                      {file.name}
                    </Text>
                    <Text className="text-blue-600 text-xs font-bold">
                      Tap to View
                    </Text>
                  </View>

                  <View className="bg-blue-600 h-8 w-8 rounded-full items-center justify-center shadow-sm">
                    <Text className="text-white font-bold text-xs">⬇</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* SUBJECTS + SESSIONS */}
          <Text className="text-gray-800 font-bold text-sm uppercase tracking-widest mb-3 opacity-70">
            Included Subjects 🔒
          </Text>

          {subjects.map((subject, idx) => {
            const isExpanded = expandedSections.includes(idx);
            const sessionCount = subject.sessions?.length || 0;

            return (
              <View
                key={subject.id}
                className="bg-white mb-4 rounded-3xl border border-gray-200 overflow-hidden shadow-sm"
              >
                {/* Accordion Header */}
                <TouchableOpacity
                  onPress={() => toggleSection(idx)}
                  activeOpacity={0.7}
                  className="bg-gray-50 p-4 border-b border-gray-100 flex-row justify-between items-center"
                >
                  <View className="flex-row items-center flex-1">
                    <View className="bg-gray-900 h-10 w-10 rounded-xl items-center justify-center mr-3 shadow-sm">
                      <Text className="text-white font-bold text-[10px]">
                        {subject.title.substring(0, 3).toUpperCase()}
                      </Text>
                    </View>

                    <View>
                      <Text className="font-bold text-gray-900 text-base">
                        {subject.title}
                      </Text>
                      <Text className="text-xs text-gray-400 font-medium">
                        {sessionCount} Paper{sessionCount !== 1 ? 's' : ''} available
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md mb-1">
                      LOCKED
                    </Text>
                    <Text className="text-gray-400 text-lg font-bold">
                      {isExpanded ? "▲" : "▼"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Expanded view */}
                {isExpanded && (
                  <View className="relative">
                    <View className="p-2 opacity-50 bg-gray-50">
                      {subject.sessions?.map((session: Session) => (
                        <View
                          key={session.id}
                          className="flex-row items-center py-3 px-3 border-b border-gray-100"
                        >
                          <Text className="text-lg mr-3">📄</Text>
                          <Text className="text-gray-600 font-medium flex-1">
                            {session.title}
                          </Text>
                          <Text className="text-xs text-gray-400">PDF</Text>
                        </View>
                      ))}

                      {sessionCount === 0 && (
                        <Text className="text-gray-400 text-xs italic p-3">
                          No papers added yet…
                        </Text>
                      )}
                    </View>

                    <Link href={`/pyq/${id}/payment` as Href} asChild>
                      <TouchableOpacity className="absolute inset-0 bg-white/40 items-center justify-center backdrop-blur-sm">
                        <View className="bg-black px-6 py-3 rounded-full shadow-lg">
                          <Text className="text-white font-bold text-sm">
                            🔒 Unlock to View
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Link>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Checkout Bar */}
        <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-5 pb-8 rounded-t-[30px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase mb-0.5">
                Full Bundle Price
              </Text>
              <View className="flex-row items-end">
                <Text className="text-3xl font-extrabold text-gray-900 leading-8">
                  ₹{pack.price}
                </Text>
                <Text className="text-gray-400 text-sm line-through ml-2 mb-1">
                  ₹99
                </Text>
              </View>
            </View>

            <Link href={`/pyq/${id}/payment` as Href} asChild>
              <TouchableOpacity className="flex-[1.5] bg-gray-900 py-4 rounded-2xl shadow-xl flex-row justify-center items-center active:scale-95">
                <Text className="text-white font-bold text-lg mr-2">
                  Unlock All 🔓
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}