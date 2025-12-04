// components/PickerSelect.tsx
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PickerSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-xs text-gray-400 mb-1">{label}</Text>

      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="border border-gray-200 rounded-xl px-3 py-3 bg-gray-50"
      >
        <Text className="text-gray-700">{value || "Select"}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide">
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white rounded-t-3xl p-4 max-h-[60%]">
            <Text className="text-center font-bold text-lg mb-3">{label}</Text>

            <ScrollView>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className="p-4 border-b border-gray-100"
                >
                  <Text className="text-gray-700">{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setOpen(false)}
              className="mt-4 p-3 bg-gray-200 rounded-xl"
            >
              <Text className="text-center font-semibold text-gray-600">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}