import { Link, Stack, useLocalSearchParams, type Href } from "expo-router";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import rightArrow from "../../assets/images/right-arrow.png";

// 1. Defined Structure for Semester Packs
type Pack = {
  id: string;
  title: string;      // e.g., "CSE 5th Sem"
  branch: string;     // e.g., "Computer Science"
  subjectsCount: number;
  subtitle: string;
  price: string;
  type: "pyq" | "answers";
  color: string;      // For UI theming
};

export default function Marketplace() {
  const { filter } = useLocalSearchParams();

  // 2. Mock Data (Semesters instead of Subjects)
  const packs: Pack[] = [
    // --- CSE Packs ---
    {
      id: "CSE_3_SEM",
      title: "CSE 3rd Sem",
      branch: "Computer Science",
      subjectsCount: 5,
      subtitle: "DSA, DCN, M3, OS, EVS",
      price: "₹19",
      type: "pyq",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      id: "CSE_5_SEM",
      title: "CSE 5th Sem",
      branch: "Computer Science",
      subjectsCount: 6,
      subtitle: "DBMS, TOC, SE, CN, Elective-1",
      price: "₹19",
      type: "pyq",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      id: "CSE_5_SEM_SOL",
      title: "CSE 5th Sem (Solutions)",
      branch: "Computer Science",
      subjectsCount: 6,
      subtitle: "Verified Model Answers",
      price: "₹49",
      type: "answers",
      color: "bg-teal-100 text-teal-700",
    },

    // --- Mechanical Packs ---
    {
      id: "MECH_3_SEM",
      title: "Mech 3rd Sem",
      branch: "Mechanical Engg",
      subjectsCount: 5,
      subtitle: "Thermo, TOM, FM, M3",
      price: "₹19",
      type: "pyq",
      color: "bg-orange-100 text-orange-700",
    },
    
    // --- Civil Packs ---
    {
      id: "CIVIL_5_SEM",
      title: "Civil 5th Sem",
      branch: "Civil Engg",
      subjectsCount: 6,
      subtitle: "Struct. Analysis, Concrete Tech",
      price: "₹19",
      type: "pyq",
      color: "bg-emerald-100 text-emerald-700",
    },
  ];

  // 3. Filter Logic
  const activeFilter = filter === "answers" ? "answers" : "pyq";
  const filteredPacks = packs.filter((p) => p.type === activeFilter);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Browse Packs",
          headerStyle: { backgroundColor: '#F8F9FC' },
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '800', fontSize: 18 }
        }} 
      />

      <SafeAreaView className="flex-1 bg-[#F8F9FC]" edges={['bottom']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="p-5 pt-2" showsVerticalScrollIndicator={false}>

          {/* A. SEARCH BAR (Visual Only) */}
          <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-6 shadow-sm">
            <Text className="text-gray-400 mr-2">🔍</Text>
            <TextInput 
              placeholder="Search 'CSE 4th Sem'..." 
              className="flex-1 font-medium text-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* B. FILTER TABS (Pills) */}
          <View className="flex-row mb-6">
            <Link href={"/pyq?filter=pyq" as Href} asChild>
              <TouchableOpacity className={`mr-3 px-5 py-2.5 rounded-full border ${activeFilter === 'pyq' ? 'bg-black border-black' : 'bg-white border-gray-200'}`}>
                <Text className={`font-bold text-xs ${activeFilter === 'pyq' ? 'text-white' : 'text-gray-600'}`}>
                  Question Papers
                </Text>
              </TouchableOpacity>
            </Link>

            <Link href={"/pyq?filter=answers" as Href} asChild>
              <TouchableOpacity className={`px-5 py-2.5 rounded-full border ${activeFilter === 'answers' ? 'bg-black border-black' : 'bg-white border-gray-200'}`}>
                <Text className={`font-bold text-xs ${activeFilter === 'answers' ? 'text-white' : 'text-gray-600'}`}>
                  Model Answers
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* C. PACKS LIST */}
          <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">
            Available Semesters ({filteredPacks.length})
          </Text>

          {filteredPacks.map((pack) => (
            <Link key={pack.id} href={`/pyq/${pack.id}/preview` as Href} asChild>
              {/* REMOVED: transition-all and active:scale-[0.98] to fix crash */}
              <TouchableOpacity className="bg-white p-5 rounded-[24px] mb-4 border border-gray-100 shadow-sm active:bg-gray-50">
                
                {/* Top Row: Branch Tag & Price */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className={`px-3 py-1 rounded-lg ${pack.color.split(' ')[0]}`}>
                    <Text className={`text-[10px] font-extrabold uppercase tracking-wide ${pack.color.split(' ')[1]}`}>
                      {pack.branch}
                    </Text>
                  </View>
                  
                  {/* Price Pill */}
                  <View className="bg-gray-900 px-3 py-1.5 rounded-full">
                    <Text className="text-white font-bold text-xs">{pack.price}</Text>
                  </View>
                </View>

                {/* Main Content */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-4">
                    <Text className="text-xl font-extrabold text-gray-900 leading-6 mb-1">
                      {pack.title}
                    </Text>
                    
                    {/* Subtitle with Subject Count */}
                    <Text className="text-gray-500 text-xs font-medium leading-4" numberOfLines={2}>
                      Includes <Text className="font-bold text-gray-800">{pack.subjectsCount} Subjects</Text>: {pack.subtitle}
                    </Text>
                  </View>

                  {/* Arrow Icon Circle */}
                  <View className="h-10 w-10 bg-gray-50 rounded-full border border-gray-100 items-center justify-center">
                    <Image source={rightArrow} className="w-10 h-4" resizeMode="contain" />
                  </View>
                </View>

              </TouchableOpacity>
            </Link>
          ))}

          {/* Empty State / Bottom Message */}
          <View className="items-center mt-4">
             <Text className="text-gray-400 text-xs font-medium">More semesters coming soon 🚀</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </>
  );
}