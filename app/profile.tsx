import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();

  // Mock User Data
  const user = {
    name: "Alex Student",
    phone: "+91 98765 43210",
    course: "B.Tech CSE",
    year: "5th Semester",
    coins: 150,
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FC]" edges={['top', 'bottom']}>
      {/* Ensure Status Bar icons are dark/visible on the light background */}
      <StatusBar style="dark" />
      
      {/* 1. Header: Hide default navigation header */}
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
        
        {/* 2. Avatar & Info Section */}
        <View className="items-center my-6">
          <View className="h-24 w-24 bg-white rounded-full items-center justify-center border-4 border-white shadow-sm mb-3 relative">
            <Text className="text-5xl">😎</Text>
            <View className="absolute bottom-0 right-0 bg-green-500 h-6 w-6 rounded-full border-2 border-white" />
          </View>
          <Text className="text-xl font-extrabold text-gray-900">{user.name}</Text>
          <Text className="text-gray-500 font-medium text-sm mt-1">
            {user.course} • {user.year}
          </Text>
        </View>

        {/* 3. Wallet & Referral Card */}
        <View className="bg-black rounded-3xl p-6 mb-8 shadow-md relative overflow-hidden">
          {/* Decorative Circle */}
          <View className="absolute -top-10 -right-10 bg-gray-800 h-32 w-32 rounded-full opacity-50" />
          
          <View className="flex-row justify-between items-start mb-6">
             <View>
               <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">My Wallet</Text>
               <Text className="text-4xl font-extrabold text-white">🪙 {user.coins}</Text>
               <Text className="text-gray-400 text-xs font-medium mt-1">Use coins to unlock Premium Packs</Text>
             </View>
          </View>

          {/* Referral Action */}
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

        {/* 4. Settings Group: Account */}
        <Text className="text-gray-900 font-bold text-base mb-3 ml-1">Account Settings</Text>
        <View className="bg-white rounded-3xl overflow-hidden mb-6 border border-gray-100 shadow-sm">
          <MenuItem icon="✏️" label="Edit Profile" />
          <MenuItem icon="🎓" label="Change Semester" value="Sem 5" />
          <MenuItem icon="📱" label="Phone Number" value={user.phone} />
        </View>

        {/* 5. Settings Group: App */}
        <Text className="text-gray-900 font-bold text-base mb-3 ml-1">App & Support</Text>
        <View className="bg-white rounded-3xl overflow-hidden mb-8 border border-gray-100 shadow-sm">
          <MenuItem icon="📥" label="My Downloads" />
          <MenuItem icon="💬" label="Help & Support" />
          <MenuItem icon="📄" label="Terms & Privacy" />
          <MenuItem icon="🚪" label="Log Out" isDestructive />
        </View>

        <View className="items-center mb-10">
           <Text className="text-gray-300 text-xs font-bold">Version 1.0.0 (Beta)</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable Menu Item Component
const MenuItem = ({ icon, label, value, isDestructive = false }: { icon: string, label: string, value?: string, isDestructive?: boolean }) => (
  <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50">
    <View className="w-8 h-8 items-center mr-3 bg-gray-50 rounded-full justify-center">
        <Text className="text-sm">{icon}</Text>
    </View>
    <Text className={`flex-1 font-bold text-sm ${isDestructive ? 'text-red-500' : 'text-gray-700'}`}>
        {label}
    </Text>
    {value && <Text className="text-gray-400 text-xs font-medium mr-2">{value}</Text>}
    <Text className="text-gray-300 font-bold">›</Text>
  </TouchableOpacity>
);