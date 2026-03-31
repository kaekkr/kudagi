import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useOrderStore, KuDagiOrder, OrderStatus } from "@kudagi/core";
import { FilterBar } from "@/components/ui/FilterBar";
import { OrderCard } from "@/components/OrderCard";
import { OrderDetailModal } from "@/components/OrderDetailModal";

export default function AdminOrderDashboard() {
  const orders = useOrderStore((s) => s.orders);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);
  const loading = useOrderStore((s) => s.loading);
  const [filter, setFilter] = useState<OrderStatus | "Все" | "Оплачено" | "Не оплачено">("Все");
  const [selected, setSelected] = useState<KuDagiOrder | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders.filter((o) => {
    if (filter === "Все") return true;
    if (filter === "Оплачено") return o.depositPaid;
    if (filter === "Не оплачено") return !o.depositPaid;
    return o.status === filter;
  });

  return (
    <View className="flex-1 bg-gray-50">
      <View style={{ paddingTop: 56, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: "#fff" }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Заказы</Text>
      </View>
      <FilterBar active={filter} onChange={setFilter} />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C5A059" />
        </View>
      ) : filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-4xl mb-3">📋</Text>
          <Text className="text-gray-400 text-center">
            {filter === "Все"
              ? "Заказов ещё нет"
              : `Нет заказов со статусом «${filter}»`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C5A059" />}
          ListHeaderComponent={
            <Text className="text-xs text-gray-400 mb-3">
              {filtered.length}{" "}
              {filtered.length === 1 ? "заказ" : "заказов"}
            </Text>
          }
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={() => setSelected(item)} />
          )}
        />
      )}

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </View>
  );
}
