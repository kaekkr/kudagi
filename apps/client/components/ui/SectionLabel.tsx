import {
  Text,
} from "react-native";

export const SectionLabel = ({ children }: { children: string }) => (
  <Text className="font-semibold text-gray-800 mb-3 mt-4">{children}</Text>
);
