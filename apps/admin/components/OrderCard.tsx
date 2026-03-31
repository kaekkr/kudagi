import {
  Text,
  Pressable,
  View
} from "react-native";
import { STATUS_ORDER } from "@/constants/constants";
import { KuDagiOrder } from "@kudagi/core";
import { StatusBadge } from "./ui/StatusBadge";
import { formatDate } from "@/utils/formatDate";
import { Badge } from "./ui/Badge";
import { PaymentBadge } from "./ui/PaymentBadge";

export const OrderCard = ({
  order,
  onPress,
}: {
  order: KuDagiOrder;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    activeOpacity={0.8}
    className="bg-white rounded-2xl mb-3 p-4 shadow-sm"
  >
    <View className="flex-row justify-between items-start mb-2">
      <View className="flex-1 mr-3">
        <Text className="font-bold text-gray-900" numberOfLines={1}>
          {order.clientName}
        </Text>
        <Text className="text-gray-400 text-xs mt-0.5">
          {order.garmentModel ?? order.orderType} · {order.phone}
        </Text>
      </View>
      <View className="flex-row gap-2 items-center">
        <PaymentBadge order={order} />
        <StatusBadge status={order.status} />
      </View>
    </View>

    <View className="flex-row mt-2">
      {STATUS_ORDER.map((s, i) => {
        const idx = STATUS_ORDER.indexOf(order.status);
        return (
          <View
            key={s}
            className={`flex-1 h-1 rounded-full mx-0.5 ${
              i <= idx ? "bg-[#C5A059]" : "bg-gray-100"
            }`}
          />
        );
      })}
    </View>

    <Text className="text-[10px] text-gray-300 mt-2">
      {formatDate(order.createdAt)}
    </Text>
  </Pressable>
);
