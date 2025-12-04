import PickerSelect from "@/components/PickerSelect";
import { BRANCHES, COLLEGES, COURSES, SEMESTERS } from "@/constants/data";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/provider/AuthProvider";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ProfileRow = {
  id: string;
  name: string | null;
  course: string | null;
  branch: string | null;
  semester: string | null;
  college: string | null;
  coins: number | null;
};

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();

  // DEFAULT UI VALUES
  const [name, setName] = useState("Student");
  const [course, setCourse] = useState("B.Tech");
  const [branch, setBranch] = useState("CSE");
  const [semester, setSemester] = useState("Not set");
  const [college, setCollege] = useState("SSGMCE");
  const [coins, setCoins] = useState(0);

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingSemester, setEditingSemester] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load profile from Supabase "profiles" table
 // Update your useEffect to log errors
useEffect(() => {
  if (!user) return;

  let mounted = true;
  (async () => {
    const { data, error: selectError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle<ProfileRow>();

    if (!mounted) return;
    
    if (selectError) {
      console.error('Error loading profile:', selectError);
      return;
    }

    if (!data) {
      console.log('No profile found, creating one...');
      // create blank row
      const { data: inserted, error: insertError } = await supabase
        .from("profiles")
        .insert({ id: user.id })
        .select("*")
        .single<ProfileRow>();
        
      if (insertError) {
        console.error('Error creating profile:', insertError);
        alert(`Failed to create profile: ${insertError.message}`);
        return;
      }
      
      if (inserted && mounted) apply(inserted);
    } else {
      apply(data);
    }
  })();

  function apply(p: ProfileRow) {
    setName(p.name ?? "Student");
    setCourse(p.course ?? "B.Tech");
    setBranch(p.branch ?? "CSE");
    setSemester(p.semester ?? "Not set");
    setCollege(p.college ?? "SSGMCE");
    setCoins(p.coins ?? 0);
  }

  return () => { mounted = false; };
}, [user]);

  async function saveProfile() {
    if (!user) return;
  
    setSaving(true);
    
    console.log('Updating profile with:', {
      name, course, branch, semester, college
    });
  
    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        course,
        branch,
        semester,
        college,
      })
      .eq("id", user.id);
  
    setSaving(false);
  
    if (error) {
      console.error('Update error:', error);
      alert(error.message);
      return;
    }
  
    console.log('Profile updated successfully!');
    setEditingProfile(false);
    setEditingSemester(false);
  }

  // Function specifically for saving semester
  async function saveSemester() {
    if (!user) return;

    setSaving(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({ semester })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingSemester(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FC]" edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header Row */}
      <View className="px-5 pt-4 pb-2 flex-row justify-between items-center">
        <Text className="text-2xl font-extrabold text-gray-900">My Profile</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-200 h-8 w-8 rounded-full items-center justify-center active:bg-gray-300"
        >
          <Text className="font-bold text-gray-600 text-xs">✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Avatar & Info Section */}
        <View className="items-center my-6">
          <View className="h-24 w-24 bg-white rounded-full items-center justify-center border-4 border-white shadow-sm mb-3 relative">
            <Text className="text-5xl">😎</Text>
            <View className="absolute bottom-0 right-0 bg-green-500 h-6 w-6 rounded-full border-2 border-white" />
          </View>
          <Text className="text-xl font-extrabold text-gray-900">{name}</Text>
          <Text className="text-gray-500 font-medium text-sm mt-1">
            {course} • {semester}
          </Text>
        </View>

        {/* Wallet & Referral Card */}
        <View className="bg-black rounded-3xl p-6 mb-8 shadow-md relative overflow-hidden">
          <View className="absolute -top-10 -right-10 bg-gray-800 h-32 w-32 rounded-full opacity-50" />
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">My Wallet</Text>
              <Text className="text-4xl font-extrabold text-white">🪙 {coins}</Text>
              <Text className="text-gray-400 text-xs font-medium mt-1">Use coins to unlock Premium Packs</Text>
            </View>
          </View>
          <View className="bg-gray-800 rounded-2xl p-4 flex-row items-center justify-between border border-gray-700">
            <View className="flex-1 mr-2">
              <Text className="text-white font-bold text-sm">Refer a Friend</Text>
              <Text className="text-gray-400 text-xs mt-0.5">Get <Text className="text-yellow-400 font-bold">+50 coins</Text> for every invite</Text>
            </View>
            <TouchableOpacity className="bg-white px-4 py-2 rounded-xl active:bg-gray-200">
              <Text className="text-black font-bold text-xs">Invite ➔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings */}
        <Text className="text-gray-900 font-bold text-base mb-3 ml-1">Account Settings</Text>
        <View className="bg-white rounded-3xl mb-6 border border-gray-100 shadow-sm overflow-hidden">
          <MenuItem 
            icon="✏️" 
            label="Edit Profile" 
            value={`${name}, ${course}, ${branch}`} 
            onPress={() => setEditingProfile(true)} 
          />
          <MenuItem 
            icon="🎓" 
            label="Change Semester" 
            value={semester} 
            onPress={() => setEditingSemester(true)} 
          />
          <MenuItem 
            icon="📱" 
            label="Phone Number" 
            value={user?.phone ?? "N/A"} 
          />
        </View>

        {/* Edit Profile Form */}
        {editingProfile && (
          <View className="bg-white rounded-3xl p-4 mb-6 border border-indigo-100 shadow-sm">
            <Text className="text-gray-900 font-bold text-base mb-3">Edit Profile</Text>
            
            <Text className="text-xs text-gray-400 mb-1">Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              className="border border-gray-200 rounded-xl px-3 py-2 mb-4"
            />

            <PickerSelect
              label="Course"
              value={course}
              options={COURSES}
              onChange={(v) => {
                setCourse(v);
                // Reset branch if not available in new course
                const branches = BRANCHES[v as keyof typeof BRANCHES];
                if (branches && !branches.includes(branch)) {
                  setBranch(branches[0]);
                }
              }}
            />

            <PickerSelect
              label="Branch"
              value={branch}
              options={BRANCHES[course as keyof typeof BRANCHES] || []}
              onChange={setBranch}
            />

            <PickerSelect
              label="College"
              value={college}
              options={COLLEGES}
              onChange={setCollege}
            />

            <View className="flex-row justify-end gap-3 mt-4">
              <TouchableOpacity
                onPress={() => setEditingProfile(false)}
                className="px-4 py-2 rounded-full border border-gray-200"
              >
                <Text className="text-gray-600 text-sm font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveProfile}
                disabled={saving}
                className="px-5 py-2 rounded-full bg-black"
              >
                <Text className="text-white text-sm font-semibold">
                  {saving ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Change Semester Form */}
        {editingSemester && (
          <View className="bg-white rounded-3xl p-4 mb-6 border border-indigo-100 shadow-sm">
            <Text className="text-gray-900 font-bold text-base mb-3">Change Semester</Text>
            
            <PickerSelect
              label="Semester"
              value={semester}
              options={SEMESTERS}
              onChange={setSemester}
            />

            <View className="mt-2 mb-4 p-3 bg-gray-50 rounded-xl">
              <Text className="text-xs text-gray-500 mb-1">Current Semester</Text>
              <Text className="text-gray-800 font-semibold">{semester}</Text>
            </View>

            <View className="flex-row justify-end gap-3 mt-4">
              <TouchableOpacity
                onPress={() => setEditingSemester(false)}
                className="px-4 py-2 rounded-full border border-gray-200"
              >
                <Text className="text-gray-600 text-sm font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveSemester}
                disabled={saving}
                className="px-5 py-2 rounded-full bg-black"
              >
                <Text className="text-white text-sm font-semibold">
                  {saving ? "Saving..." : "Save Semester"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* App & Support */}
        <Text className="text-gray-900 font-bold text-base mb-3 ml-1">App & Support</Text>
        <View className="bg-white rounded-3xl overflow-hidden mb-8 border border-gray-100 shadow-sm">
          <MenuItem icon="🛒" label="My Orders" />
          <MenuItem icon="💬" label="Help & Support" />
          <MenuItem icon="📄" label="Terms & Privacy" />
          <MenuItem
            icon="🚪"
            label="Log Out"
            isDestructive
            onPress={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                alert(error.message);
                return;
              }
              router.replace("/auth/login");
            }}
          />
        </View>

        <View className="items-center mb-10">
          <Text className="text-gray-300 text-xs font-bold">Version 1.0.0 (Beta)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable Menu Item Component
const MenuItem = ({ 
  icon, 
  label, 
  value, 
  isDestructive = false, 
  onPress 
}: {
  icon: string;
  label: string;
  value?: string;
  isDestructive?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50"
  >
    <View className="w-8 h-8 items-center mr-3 bg-gray-50 rounded-full justify-center">
      <Text>{icon}</Text>
    </View>
    <Text className={`flex-1 font-bold text-sm ${isDestructive ? "text-red-500" : "text-gray-700"}`}>
      {label}
    </Text>
    {value && <Text className="text-gray-400 text-xs mr-2">{value}</Text>}
    <Text className="text-gray-300 font-bold">›</Text>
  </TouchableOpacity>
);