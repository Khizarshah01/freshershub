import { Link, useRouter, type Href } from "expo-router";
import idea from "../assets/images/idea.png";
import rightArrow from "../assets/images/right-arrow.png";
import test from "../assets/images/test.png";
// 1. Added 'Image' to the imports below
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/provider/AuthProvider";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Defines the data structure for a Pack
type Pack = {
  id: string;
  title: string;
  branch: string;
  subjectsCount: number;
  subtitle: string;
  price: string;
  type: "pyq" | "model";
  color: string;
  tag?: string; // For "Trending" or "High Demand"
};

function getColor(branch: string) {
  switch (branch) {
    case "Computer Science":
      return "bg-indigo-100 text-indigo-700";
    case "Mechanical Engineering":
      return "bg-orange-100 text-orange-700";
    case "Civil Engineering":
      return "bg-emerald-100 text-emerald-700";
    case "Information Technology":
      return "bg-teal-100 text-teal-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [explorePacks, setExplorePacks] = useState<Pack[]>([]);
const [loadingPacks, setLoadingPacks] = useState(true);

useEffect(() => {
  fetchPacks();
}, []);

async function fetchPacks() {
  const { data, error } = await supabase
    .from("packs")
    .select("*");

  if (error) {
    console.log("PACKS FETCH ERROR:", error);
    return;
  }
  
  if (!data) {
    setExplorePacks([]);
    setLoadingPacks(false);
    return;
  }
  

  // Convert database rows to UI pack format
  const formatted = data.map((p) => ({
    id: p.id,
    title: p.title,
    branch: p.branch,
    subjectsCount: p.subjects_count,
    subtitle: p.subtitle,
    price: `₹${p.price}`,
    type: p.type,
    color: getColor(p.branch), // dynamically assign UI color
  }));

  setExplorePacks(formatted);
  setLoadingPacks(false);
}

  // If not logged in, send user to login screen
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  // Mock Data: My Library (Empty for now)
  const myLibrary: Pack[] = []; 
  
  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FC]">
      <ScrollView showsVerticalScrollIndicator={false} className="p-5">
      
        {/* ============================================================
            1. CUSTOM HEADER
           ============================================================ */}
        <View className="flex-row justify-between items-center mb-8 mt-2">
          <View>
            <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
              Welcome Back
            </Text>
            <Text className="text-2xl font-extrabold text-gray-900">
              Student 👋
            </Text>
          </View>

          {/* Profile Button */}
          <Link href={"/profile" as Href} asChild>
            <TouchableOpacity className="h-12 w-12 bg-indigo-50 rounded-full items-center justify-center border-2 border-indigo-100 shadow-sm relative active:scale-95">
               <Text className="text-2xl">😎</Text>
               {/* Online Status Dot */}
               <View className="absolute top-0 right-0 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* ============================================================
            2. MY LIBRARY SECTION
           ============================================================ */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-3">My Library</Text>

          {myLibrary.length === 0 ? (
            // Sales-focused Empty State
            <View className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <View className="flex-row items-center mb-2">
                 <View className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                 <Text className="text-gray-800 font-bold text-base">Not Prepared Yet?</Text>
              </View>
              
              <Text className="text-gray-500 text-sm mb-4 leading-5">
                Don't just read PDFs. Get PYQs with <Text className="text-blue-600 font-bold">Repeated Question Indicators</Text> and Smart Analysis.
              </Text>
              
              <Link href={"/pyq?filter=pyq" as Href} asChild>
                <TouchableOpacity className="bg-gray-900 py-3 px-6 rounded-full self-start">
                  <Text className="text-white font-bold text-sm">Start Now &rarr;</Text>
                </TouchableOpacity>
              </Link>
            </View>
          ) : (
            // User has purchased something
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
               {myLibrary.map((c) => (
                 <Link key={c.id} href={`/pyq/${c.id}/preview` as Href} asChild>
                   <TouchableOpacity className="bg-white p-4 rounded-3xl mr-3 w-40 border border-gray-200">
                     <Text className="font-bold text-gray-800 mb-1" numberOfLines={1}>{c.title}</Text>
                     <Text className="text-green-600 text-xs font-bold">● Active</Text>
                   </TouchableOpacity>
                 </Link>
               ))}
            </ScrollView>
          )}
        </View>

        {/* ============================================================
            3. START PREPARING (Categories)
           ============================================================ */}
        <Text className="text-lg font-bold text-gray-800 mb-3">Start Preparing</Text>
        <View className="flex-row gap-3 mb-8">
          
          {/* Card 1: PYQ + Syllabus */}
          <Link href={"/pyq?filter=pyq" as Href} asChild>
            <TouchableOpacity className="flex-1 bg-indigo-600 p-5 rounded-[20px] h-44 justify-between shadow-indigo-200 shadow-lg">
              <View className="bg-white/20 w-12 h-12 rounded-full items-center justify-center">
                 {/* 2. Added resizeMode="contain" to keep icon aspect ratio */}
                 <Image source={test} className="w-8 h-8" resizeMode="contain" />
              </View>
              <View>
                <Text className="text-white font-bold text-xl leading-6">University{"\n"}PYQs</Text>
                <View className="bg-indigo-800/50 self-start px-2 py-1 rounded-md mt-2">
                   <Text className="text-indigo-100 text-[10px] font-bold">WITH REPEAT TAGS</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Card 2: Model Answers */}
          <Link href={"/pyq?filter=answers" as Href} asChild>
            <TouchableOpacity className="flex-1 bg-teal-600 p-5 rounded-[20px] h-44 justify-between shadow-teal-200 shadow-lg">
               <View className="bg-white/20 w-12 h-12 rounded-full items-center justify-center">
                {/* 3. Added tintColor="white" if you want the icon to be white, otherwise remove it */}
                <Image source={idea} className="w-8 h-8" resizeMode="contain" />
              </View>
              <View>
                <Text className="text-white font-bold text-xl leading-6">Model{"\n"}Answers</Text>
                <View className="bg-teal-800/50 self-start px-2 py-1 rounded-md mt-2">
                   <Text className="text-teal-100 text-[10px] font-bold">100% VERIFIED</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        </View>

        {/* ============================================================
            4. EXPLORE LIST (Using New Data Structure)
           ============================================================ */}
        <View className="flex-row justify-between items-end mb-4">
          <Text className="text-lg font-bold text-gray-800">Explore Courses</Text>
          <Link href={"/pyq?filter=all" as Href} asChild>
             <TouchableOpacity>
                <Text className="text-gray-400 text-xs font-bold pb-1">VIEW ALL</Text>
             </TouchableOpacity>
          </Link>
        </View>
        
        <View className="pb-10">
          {explorePacks.map((pack) => (
            <Link key={pack.id} href={`/pyq/${pack.id}/preview` as Href} asChild>
              <TouchableOpacity className="bg-white p-4 rounded-3xl mb-3 border border-gray-100 shadow-sm active:bg-gray-50">
                
                {/* Header: Branch Badge & Price */}
                <View className="flex-row justify-between items-center mb-3">
                   {/* Branch Pill (e.g. Blue for CSE, Orange for Mech) */}
                   <View className={`px-2 py-1 rounded-md ${pack.color.split(' ')[0]}`}>
                      <Text className={`text-[10px] font-extrabold uppercase tracking-wide ${pack.color.split(' ')[1]}`}>
                        {pack.branch}
                      </Text>
                   </View>
                   
                   {/* Price Pill */}
                   <View className="bg-gray-900 px-3 py-1 rounded-full">
                      <Text className="text-white font-bold text-xs">{pack.price}</Text>
                   </View>
                </View>

                {/* Content: Title & Info */}
                <View className="flex-row items-center">
                    {/* Icon Box */}
                    <View className="h-12 w-12 bg-gray-50 rounded-2xl items-center justify-center mr-4 border border-gray-100">
                      <Text className="text-lg font-bold text-gray-400">{pack.title.charAt(0)}</Text>
                    </View>

                    <View className="flex-1 pr-2">
                      <Text className="font-bold text-gray-900 text-base">{pack.title}</Text>
                      <Text className="text-gray-400 text-xs mt-0.5">
                        <Text className="text-gray-600 font-bold">{pack.subjectsCount} Subjects</Text>: {pack.subtitle}
                      </Text>
                    </View>
                    
                    {/* Arrow */}
                    
                    <View className="h-10 w-10 bg-gray-50 rounded-full border border-gray-100 items-center justify-center">
                    <Image source={rightArrow} className="w-10 h-4" resizeMode="contain" />
                  </View>
                </View>

              </TouchableOpacity>
            </Link>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}