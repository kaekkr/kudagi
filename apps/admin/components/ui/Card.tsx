import { View } from "react-native";

export const Card = ({ children }: { children: React.ReactNode }) => (
  <View className="bg-white rounded-2xl px-4 py-1">{children}</View>
);
