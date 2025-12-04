import { Text, View } from "react-native";

export default function PaymentScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center px-5">
      <Text className="text-xs font-bold text-orange-500 mb-1 uppercase">
        Dummy Screen
      </Text>
      <Text className="text-2xl font-extrabold text-gray-900 mb-1">
        Payment Screen
      </Text>
      <Text className="text-gray-500 text-center text-sm">
        This is a placeholder NativeWind UI for
        {" "}
        <Text className="font-semibold">/pyq/[id]/payment</Text>.
      </Text>
    </View>
  );
}
