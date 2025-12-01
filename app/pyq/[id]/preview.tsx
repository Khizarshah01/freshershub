import { Link, Stack, useLocalSearchParams, type Href } from "expo-router";
import { useState } from "react";
import { LayoutAnimation, Platform, ScrollView, Text, TouchableOpacity, UIManager, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Preview() {
  const { id } = useLocalSearchParams();
  
  // State to track which subjects are expanded (Array of indices)
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    // Optional: Add smooth animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setExpandedSections((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index); // Collapse
      } else {
        return [...prev, index]; // Expand
      }
    });
  };

  // Mock Data
  const packDetails = {
    title: "CSE 3rd Year - All Subjects",
    subtitle: "Complete PYQ Bundle",
    totalSubjects: 5,
    totalFiles: 42,
    
    syllabus: {
      title: "Syllabus Copy",
      files: [
        { name: "Official Syllabus 2025.pdf", type: "PDF", date: "Updated" }
      ]
    },

    subjects: [
      {
        code: "DSA",
        name: "Data Structures & Algo",
        files: ["Summer 2024 Paper", "Winter 2023 Paper", "Summer 2023 Paper", "Model Answer Sheet"]
      },
      {
        code: "DCN",
        name: "Data Communication",
        files: ["Summer 2024 Paper", "Winter 2023 Paper", "Model Answer Sheet"]
      },
      {
        code: "OS",
        name: "Operating Systems",
        files: ["Summer 2024 Paper", "Winter 2023 Paper", "2022 Repeats Analysis"]
      },
      {
        code: "M3",
        name: "Engineering Math III",
        files: ["Summer 2024 Paper", "Formula Sheet"]
      }
    ]
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Pack Preview",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#F8F9FC" },
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "800", fontSize: 18 }
        }} 
      />

      <SafeAreaView className="flex-1 bg-[#F8F9FC]" edges={['bottom']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="p-5 pt-0" showsVerticalScrollIndicator={false}>
          
          {/* 1. HEADER */}
          <View className="mb-6 mt-2">
            <View className="bg-black self-start px-3 py-1 rounded-full mb-3">
               <Text className="text-white font-bold text-[10px] uppercase tracking-wider">⚡ Best Value Pack</Text>
            </View>
            <Text className="text-3xl font-extrabold text-gray-900 leading-9">{packDetails.title}</Text>
            <Text className="text-gray-500 font-medium mt-1">Contains {packDetails.totalSubjects} Subjects • {packDetails.totalFiles} PDFs</Text>
          </View>

          {/* 2. FREE SECTION */}
          <View className="mb-6">
            <Text className="text-gray-800 font-bold text-sm uppercase tracking-widest mb-3 opacity-70">
               Free Access 🔓
            </Text>
            <View className="bg-white p-1 rounded-2xl border border-blue-100 shadow-sm">
              {packDetails.syllabus.files.map((file, i) => (
                <TouchableOpacity key={i} className="flex-row items-center p-4 bg-blue-50/50 rounded-xl active:bg-blue-100">
                   <View className="h-10 w-10 bg-blue-100 rounded-lg items-center justify-center mr-3">
                      <Text className="text-lg">📜</Text>
                   </View>
                   <View className="flex-1">
                      <Text className="text-gray-900 font-bold text-base">{file.name}</Text>
                      <Text className="text-blue-600 text-xs font-bold">Tap to View</Text>
                   </View>
                   <View className="bg-blue-600 h-8 w-8 rounded-full items-center justify-center shadow-sm">
                      <Text className="text-white font-bold text-xs">⬇</Text>
                   </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 3. LOCKED SECTION (ACCORDION) */}
          <Text className="text-gray-800 font-bold text-sm uppercase tracking-widest mb-3 opacity-70">
             Included Subjects 🔒
          </Text>

          {packDetails.subjects.map((subject, idx) => {
            const isExpanded = expandedSections.includes(idx);

            return (
              <View key={idx} className="bg-white mb-4 rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                
                {/* Clickable Header for Accordion */}
                <TouchableOpacity 
                  onPress={() => toggleSection(idx)}
                  activeOpacity={0.7}
                  className="bg-gray-50 p-4 border-b border-gray-100 flex-row justify-between items-center"
                >
                  <View className="flex-row items-center flex-1">
                    <View className="bg-gray-900 h-10 w-10 rounded-xl items-center justify-center mr-3 shadow-sm">
                       <Text className="text-white font-bold text-[10px]">{subject.code}</Text>
                    </View>
                    <View>
                      <Text className="font-bold text-gray-900 text-base">{subject.name}</Text>
                      <Text className="text-xs text-gray-400 font-medium">
                        {isExpanded ? 'Tap to collapse' : `${subject.files.length} files inside`}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Chevron Icon & Lock Badge */}
                  <View className="items-end">
                    <Text className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md mb-1 overflow-hidden">
                      LOCKED
                    </Text>
                    <Text className="text-gray-400 text-lg font-bold">
                      {isExpanded ? "▲" : "▼"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Conditional Rendering for Files */}
                {isExpanded && (
                  <View className="relative">
                    <View className="p-2 opacity-50 bg-gray-50">
                       {subject.files.map((file, fIdx) => (
                         <View key={fIdx} className="flex-row items-center py-3 px-3 border-b border-gray-100 last:border-0">
                            <Text className="text-lg mr-3">📄</Text>
                            <Text className="text-gray-600 font-medium flex-1">{file}</Text>
                            <Text className="text-xs text-gray-400">PDF</Text>
                         </View>
                       ))}
                       <View className="py-4 items-center">
                          <Text className="text-xs text-gray-400 font-medium italic">+ more resources hidden</Text>
                       </View>
                    </View>

                    {/* Lock Overlay is ONLY inside the expanded view now */}
                    <Link href={`/pyq/${id}/payment` as Href} asChild>
                      <TouchableOpacity className="absolute inset-0 bg-white/40 items-center justify-center backdrop-blur-sm">
                        <View className="bg-black px-6 py-3 rounded-full shadow-lg">
                           <Text className="text-white font-bold text-sm">🔒 Unlock to View</Text>
                        </View>
                      </TouchableOpacity>
                    </Link>
                  </View>
                )}
              </View>
            );
          })}

        </ScrollView>

        {/* 4. STICKY CHECKOUT BAR */}
        <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-5 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[30px]">
           <View className="flex-row items-center justify-between gap-4">
             <View className="flex-1">
               <Text className="text-gray-400 text-xs font-bold uppercase mb-0.5">Full Bundle Price</Text>
               <View className="flex-row items-end">
                 <Text className="text-3xl font-extrabold text-gray-900 leading-8">₹19</Text>
                 <Text className="text-gray-400 text-sm line-through ml-2 mb-1">₹99</Text>
               </View>
             </View>

             <Link href={`/pyq/${id}/payment` as Href} asChild>
              <TouchableOpacity className="flex-[1.5] bg-gray-900 py-4 rounded-2xl shadow-xl active:scale-95 flex-row justify-center items-center">
                <Text className="text-white font-bold text-lg mr-2">Unlock All 🔓</Text>
              </TouchableOpacity>
             </Link>
           </View>
        </View>

      </SafeAreaView>
    </>
  );
}