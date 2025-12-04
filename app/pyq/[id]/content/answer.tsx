import { Text, View } from "react-native";

export default function AnswerScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center px-5">
      <Text className="text-xs font-bold text-blue-500 mb-1 uppercase">
        Dummy Screen
      </Text>
      <Text className="text-2xl font-extrabold text-gray-900 mb-1">
        Answers Coming Soon
      </Text>
      <Text className="text-gray-500 text-center text-sm">
        This is a placeholder NativeWind-powered UI for
        {" "}
        <Text className="font-semibold">/pyq/[id]/content/answer</Text>.
      </Text>
    </View>
  );
}
