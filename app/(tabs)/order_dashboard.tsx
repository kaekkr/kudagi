import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useOrderStore, OrderStatus } from "../../store/useOrderStore";
import { Clock, User, Phone, Tag } from "lucide-react-native";

const STATUSES: OrderStatus[] = [
  "Принято",
  "Крой",
  "Вышивка",
  "Пошив",
  "Готово",
  "Отправка",
];

export default function OrderDashboardScreen() {
  const { orders, updateOrderStatus } = useOrderStore();

  const renderOrderItem = ({ item }: { item: any }) => {
    if (!item || !item.id) return null;

    // Добавляем отсутствующий return здесь!
    return (
      <View className="bg-white m-4 p-5 rounded-[32px] border border-gray-100 shadow-sm">
        {/* Шапка карточки */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="bg-gold/10 px-4 py-1.5 rounded-full">
            <Text className="text-gold font-bold text-xs">{item.status}</Text>
          </View>
          <Text className="text-gray-400 text-xs">
            ID: {item.id.slice(0, 8)}
          </Text>
        </View>

        {/* Инфо о клиенте */}
        <View className="space-y-2 mb-4">
          <View className="flex-row items-center">
            <User size={16} color="#C5A059" />
            <Text className="text-lg font-bold ml-2">{item.clientName}</Text>
          </View>
          <View className="flex-row items-center">
            <Phone size={14} color="#9CA3AF" />
            <Text className="text-gray-500 ml-2">{item.phone}</Text>
          </View>
          <View className="flex-row items-center">
            <Tag size={14} color="#9CA3AF" />
            <Text className="text-gray-500 ml-2">{item.orderType}</Text>
          </View>
        </View>

        <View className="h-[1px] bg-gray-100 w-full mb-4" />

        {/* Выбор статуса (Scrollable) */}
        <Text className="text-[10px] uppercase text-gray-400 font-bold mb-3 tracking-widest">
          Изменить статус
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-4"
        >
          {STATUSES.map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => updateOrderStatus(item.id, status)}
              className={`mr-2 px-4 py-2 rounded-xl border ${
                item.status === status
                  ? "bg-black border-black"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  item.status === status ? "text-white" : "text-gray-600"
                }`}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Время обновления */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Clock size={12} color="#9CA3AF" />
            <Text className="text-gray-400 text-[10px] ml-1">
              Обновлено: {item.statusUpdatedAt || item.createdAt}
            </Text>
          </View>
          <Text className="font-bold text-black">
            {item.totalPrice ? item.totalPrice.toLocaleString() : "0"} ₸
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50/50">
      <View className="pt-16 pb-6 px-6 bg-white rounded-b-[40px] shadow-sm">
        <Text className="text-3xl font-black text-black">Заказы</Text>
        <Text className="text-gray-400 text-sm mt-1">
          Панель управления менеджера
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
      />
    </View>
  );
}
