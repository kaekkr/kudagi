import { View, Text } from "react-native";

export const Row = ({ label, value }: { label: string; value?: string | number }) => (
  <View className="flex-row justify-between py-2.5 border-b border-gray-50">
    <Text className="text-gray-400 text-sm">{label}</Text>
    <Text className="text-gray-800 text-sm font-medium flex-shrink-1 ml-4 text-right">
      {value ?? "—"}
    </Text>
  </View>
);
