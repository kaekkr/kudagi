import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { useOrderStore, KuDagiOrder, OrderStatus } from "@kudagi/core";
import { FilterBar } from "@/components/ui/FilterBar";
import { OrderCard } from "@/components/OrderCard";
import { OrderDetailModal } from "@/components/OrderDetailModal";

export default function AdminOrderDashboard() {
  const orders      = useOrderStore((s) => s.orders);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);
  const loading     = useOrderStore((s) => s.loading);
  const error       = useOrderStore((s) => s.error);

  const [filter, setFilter] = useState<OrderStatus | "Все" | "Оплачено" | "Не оплачено">("Все");
  const [selected, setSelected] = useState<KuDagiOrder | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Direct raw fetch to verify network + env vars work
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const key = process.env.EXPO_PUBLIC_SUPABASE_KEY;
    console.log("SUPABASE_URL:", url);
    console.log("SUPABASE_KEY:", key ? "present" : "MISSING");

    fetch(`${url}/rest/v1/orders?select=id,client_name&limit=3&order=created_at.desc`, {
      headers: { apikey: key!, Authorization: `Bearer ${key}` },
    })
      .then((r) => r.json())
      .then((d) => console.log("RAW FETCH RESULT:", JSON.stringify(d)))
      .catch((e) => console.log("RAW FETCH ERROR:", e.message));

    fetchOrders().then(() => {
      const state = useOrderStore.getState();
      console.log("STORE ORDERS COUNT:", state.orders.length);
      console.log("STORE ERROR:", state.error);
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const initialLoading = loading && orders.length === 0;

  console.log("RENDER STATE — loading:", loading, "orders:", orders.length, "initialLoading:", initialLoading);

  const selectedOrder = selected
    ? orders.find((o) => o.id === selected.id) ?? selected
    : null;

  const filtered = orders.filter((o) => {
    if (filter === "Все")          return true;
    if (filter === "Оплачено")     return o.depositPaid;
    if (filter === "Не оплачено")  return !o.depositPaid;
    return o.status === filter;
  });

  console.log("FILTERED:", filtered.length, "FILTER:", filter, "FIRST ORDER:", orders[0]?.clientName, orders[0]?.status);

  return (
    <View className="flex-1 bg-gray-50">
      <View style={{ paddingTop: 56, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: "#fff" }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Заказы</Text>
      </View>

      {/* Show fetch error prominently */}
      {error ? (
        <View style={{ backgroundColor: "#FEF2F2", margin: 16, padding: 14, borderRadius: 12 }}>
          <Text style={{ color: "#DC2626", fontWeight: "700", marginBottom: 4 }}>Ошибка загрузки</Text>
          <Text style={{ color: "#DC2626", fontSize: 12 }}>{error}</Text>
          <Pressable onPress={fetchOrders} style={{ marginTop: 10, backgroundColor: "#DC2626", borderRadius: 8, padding: 10, alignItems: "center" }}>
            <Text style={{ color: "white", fontWeight: "700" }}>Повторить</Text>
          </Pressable>
        </View>
      ) : null}

      <FilterBar active={filter} onChange={setFilter} />

      {initialLoading ? (
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
          <Pressable onPress={fetchOrders} style={{ marginTop: 16, backgroundColor: "#C5A059", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ color: "white", fontWeight: "700" }}>Обновить</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C5A059" />
          }
          ListHeaderComponent={
            <Text className="text-xs text-gray-400 mb-3">
              {filtered.length} {filtered.length === 1 ? "заказ" : "заказов"}
            </Text>
          }
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={() => setSelected(item)} />
          )}
        />
      )}

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelected(null)} />
      )}
    </View>
  );
}
