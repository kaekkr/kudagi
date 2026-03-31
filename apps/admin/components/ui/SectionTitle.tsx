import {
  Text,
} from "react-native";

export const SectionTitle = ({ children }: { children: string }) => (
  <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-5">
    {children}
  </Text>
);
