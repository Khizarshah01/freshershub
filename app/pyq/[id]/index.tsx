import { Link, useLocalSearchParams, type Href } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PackDetails() {
  const { id } = useLocalSearchParams();

  // Mock pack data
  const pack = {
    title: id.toString().replaceAll("_", " "),
    price: id.toString().includes("SOL") ? "₹49" : "₹19",
    includes: [
      "Syllabus PDF",
      "All Years Question Papers",
      "Repeat Analysis",
    ],
  };

  return (
    <ScrollView className="bg-[#F8F9FC] flex-1 p-5">
      <Text className="text-2xl font-extrabold text-gray-900 mb-3">{pack.title}</Text>

      <Text className="text-gray-500 mb-6">
        See what’s included before buying 👇
      </Text>

      <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-6">
        {pack.includes.map((item, i) => (
          <View key={i} className="flex-row mb-3">
            <Text className="text-blue-600 font-bold mr-2">•</Text>
            <Text className="text-gray-700">{item}</Text>
          </View>
        ))}

        {/* Preview button */}
        <Link href={`/pyq/${id}/preview` as Href} asChild>
          <TouchableOpacity className="bg-gray-900 py-3 px-4 rounded-xl mt-3">
            <Text className="text-white text-center font-bold">Preview Pack →</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Buy Section */}
      <Link href={`/pyq/${id}/payment` as Href} asChild>
        <TouchableOpacity className="bg-indigo-600 p-4 rounded-2xl">
          <Text className="text-white font-bold text-center text-lg">
            Buy for {pack.price}
          </Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}