import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useOrderStore, KuDagiOrder, OrderStatus } from "@kudagi/core";

const STATUS_ORDER: OrderStatus[] = [
  "Принято", "Крой", "Вышивка", "Пошив", "Готово", "Отправка",
];

const STATUS_STYLE: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  Принято:  { bg: "bg-blue-50",   text: "text-blue-600",   dot: "bg-blue-400" },
  Крой:     { bg: "bg-yellow-50", text: "text-yellow-600", dot: "bg-yellow-400" },
  Вышивка:  { bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-400" },
  Пошив:    { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-400" },
  Готово:   { bg: "bg-green-50",  text: "text-green-600",  dot: "bg-green-500" },
  Отправка: { bg: "bg-gray-100",  text: "text-gray-600",   dot: "bg-gray-400" },
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

// ── Status pill ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const s = STATUS_STYLE[status];
  return (
    <View className={`flex-row items-center px-3 py-1.5 rounded-full ${s.bg}`}>
      <View className={`w-2 h-2 rounded-full mr-1.5 ${s.dot}`} />
      <Text className={`text-xs font-semibold ${s.text}`}>{status}</Text>
    </View>
  );
};

// ── Order card (list item) ───────────────────────────────────────────────────
const OrderCard = ({
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
      <StatusBadge status={order.status} />
    </View>

    {/* Mini progress bar */}
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

// ── Detail row helper ────────────────────────────────────────────────────────
const Row = ({ label, value }: { label: string; value?: string | number }) => (
  <View className="flex-row justify-between py-2.5 border-b border-gray-50">
    <Text className="text-gray-400 text-sm">{label}</Text>
    <Text className="text-gray-800 text-sm font-medium flex-shrink-1 ml-4 text-right">
      {value ?? "—"}
    </Text>
  </View>
);

// ── Order detail modal ───────────────────────────────────────────────────────
const OrderDetailModal = ({
  order,
  onClose,
}: {
  order: KuDagiOrder;
  onClose: () => void;
}) => {
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const [selected, setSelected] = useState<OrderStatus>(order.status);

  const handleSave = () => {
    updateOrderStatus(order.id, selected);
    onClose();
  };

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-100">
          <Text className="text-lg font-bold" numberOfLines={1}>
            {order.clientName}
          </Text>
          <Pressable onPress={onClose} className="p-2">
            <Text className="text-gray-400 text-base">✕</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
          {/* Client */}
          <SectionTitle>Клиент</SectionTitle>
          <Card>
            <Row label="Имя" value={order.clientName} />
            <Row label="Телефон" value={order.phone} />
            <Row label="WhatsApp" value={order.whatsApp} />
            <Row label="Город" value={order.city} />
            <Row label="Адрес" value={order.address} />
          </Card>

          {/* Order */}
          <SectionTitle>Заказ</SectionTitle>
          <Card>
            <Row label="Модель" value={order.garmentModel} />
            <Row label="Вид заказа" value={order.orderType} />
            <Row label="Орнамент" value={order.ornamentType} />
            <Row label="Расположение" value={order.ornamentPosition} />
            <Row label="Цвет ниток" value={order.embroideryColor} />
          </Card>

          {/* Measurements */}
          <SectionTitle>Мерки (см)</SectionTitle>
          <Card>
            <Row label="Рост" value={order.measurements?.height || "—"} />
            <Row label="Грудь" value={order.measurements?.chest || "—"} />
            <Row label="Талия" value={order.measurements?.waist || "—"} />
            <Row label="Бёдра" value={order.measurements?.hips || "—"} />
          </Card>

          {/* Payment */}
          <SectionTitle>Оплата</SectionTitle>
          <Card>
            <Row label="Способ оплаты" value={order.paymentMethod} />
            <Row
              label="Полная стоимость"
              value={order.totalPrice ? `${order.totalPrice.toLocaleString("ru-RU")} ₸` : "—"}
            />
            <Row
              label="Предоплата 50%"
              value={
                order.totalPrice
                  ? `${(order.totalPrice / 2).toLocaleString("ru-RU")} ₸`
                  : "—"
              }
            />
            <Row label="Предоплата внесена" value={order.depositPaid ? "✅ Да" : "❌ Нет"} />
          </Card>

          {/* Status editor */}
          <SectionTitle>Статус производства</SectionTitle>
          <Card>
            <Text className="text-xs text-gray-400 mb-3">
              Обновлён: {formatDate(order.statusUpdatedAt)}
            </Text>
            <View className="flex-row flex-wrap">
              {STATUS_ORDER.map((s) => {
                const style = STATUS_STYLE[s];
                const active = selected === s;
                return (
                  <Pressable
                    key={s}
                    onPress={() => setSelected(s)}
                    className={`mr-2 mb-2 px-4 py-2.5 rounded-xl border-2 ${
                      active
                        ? "border-[#C5A059] bg-[#C5A059]/10"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        active ? "text-[#C5A059]" : "text-gray-400"
                      }`}
                    >
                      {s}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          {/* Save button */}
          <Pressable
            onPress={handleSave}
            className="bg-[#C5A059] p-4 rounded-2xl items-center mt-4"
          >
            <Text className="text-white font-bold text-base">Сохранить статус</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
};

// ── Small layout helpers ─────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: string }) => (
  <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-5">
    {children}
  </Text>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <View className="bg-white rounded-2xl px-4 py-1">{children}</View>
);

// ── Filter bar ───────────────────────────────────────────────────────────────
const FilterBar = ({
  active,
  onChange,
}: {
  active: OrderStatus | "Все";
  onChange: (f: OrderStatus | "Все") => void;
}) => {
  const filters: (OrderStatus | "Все")[] = ["Все", ...STATUS_ORDER];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, alignItems: "center" }}
    >
      {filters.map((f) => (
        <Pressable
          key={f}
          onPress={() => onChange(f)}
          style={{
            height: 34,
            paddingHorizontal: 16,
            borderRadius: 17,
            marginRight: 8,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: active === f ? "#C5A059" : "#FFFFFF",
            borderWidth: 1,
            borderColor: active === f ? "#C5A059" : "#E5E7EB",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: active === f ? "#FFFFFF" : "#9CA3AF",
            }}
          >
            {f}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

// ── Main screen ──────────────────────────────────────────────────────────────
export default function AdminOrderDashboard() {
  const orders = useOrderStore((s) => s.orders);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);
  const loading = useOrderStore((s) => s.loading);
  const [filter, setFilter] = useState<OrderStatus | "Все">("Все");
  const [selected, setSelected] = useState<KuDagiOrder | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered =
    filter === "Все" ? orders : orders.filter((o) => o.status === filter);

  return (
    <View className="flex-1 bg-gray-50">
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
