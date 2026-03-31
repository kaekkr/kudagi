import {
  Text,
  View
} from "react-native";
import { OrderStatus } from "@kudagi/core";
import { STATUS_STYLE } from "@/constants/constants";

export const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const s = STATUS_STYLE[status] ?? { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" };
  return (
    <View className={`flex-row items-center px-3 py-1.5 rounded-full ${s.bg}`}>
      <View className={`w-2 h-2 rounded-full mr-1.5 ${s.dot}`} />
      <Text className={`text-xs font-semibold ${s.text}`}>{status}</Text>
    </View>
  );
};
