import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useOrderStore, OrderStatus } from "../../store/useOrderStore";
import {
  Clock,
  CheckCircle2,
  Package,
  Scissors,
  Activity,
} from "lucide-react-native";

const STATUS_ORDER: OrderStatus[] = [
  "Принято",
  "Крой",
  "Вышивка",
  "Пошив",
  "Готово",
  "Отправка",
];

export default function OrderDashboard() {
  const { orders, updateOrderStatus } = useOrderStore();

  const renderOrderItem = ({ item }: { item: any }) => (
    <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-lg font-bold text-gray-900">
            {item.clientName}
          </Text>
          <Text className="text-gray-400 text-xs">
            {item.orderType} • {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View className="bg-[#C5A059]/10 px-3 py-1 rounded-full">
          <Text className="text-[#C5A059] text-xs font-bold">
            {item.status}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-50">
        <Text className="font-semibold text-gray-700">
          {item.totalPrice.toLocaleString()} ₸
        </Text>
        <Text className="text-gray-400 text-xs">{item.phone}</Text>
      </View>

      {/* Status Transition Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4 flex-row"
      >
        {STATUS_ORDER.map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => updateOrderStatus(item.id, status)}
            className={`mr-2 px-3 py-2 rounded-lg border ${
              item.status === status
                ? "bg-[#C5A059] border-[#C5A059]"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <Text
              className={`text-[10px] ${item.status === status ? "text-white font-bold" : "text-gray-400"}`}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row items-center mb-6 mt-2">
        <Activity size={24} color="#C5A059" />
        <Text className="text-2xl font-bold ml-2">Очередь KuDAGI</Text>
      </View>

      {orders.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Clock size={48} color="#D1D1D1" />
          <Text className="text-gray-400 mt-4 text-center">
            Заказов пока нет.{"\n"}Оформите первый на вкладке «Новый заказ»
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
