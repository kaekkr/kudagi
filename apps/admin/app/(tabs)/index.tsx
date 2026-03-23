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
  Image,
  Alert,
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
      <View style={{ alignItems: "flex-end" }}>
        <StatusBadge status={order.status} />
        <View style={{
          flexDirection: "row", alignItems: "center",
          backgroundColor: order.depositPaid ? "#DCFCE7" : "#FEF2F2",
          paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginTop: 4,
        }}>
          <Text style={{ fontSize: 10, fontWeight: "600", color: order.depositPaid ? "#16A34A" : "#EF4444" }}>
            {order.depositPaid ? "✅ Предоплата" : "⏳ Ожидает"}
          </Text>
        </View>
      </View>
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

// ── Deposit toggle ───────────────────────────────────────────────────────────
const DepositToggle = ({ order }: { order: KuDagiOrder }) => {
  const [confirmed, setConfirmed] = useState(order.depositPaid);
  const [saving, setSaving] = useState(false);
  const updateDeposit = useOrderStore((s) => s.updateDepositPaid);

  const toggle = async () => {
    const next = !confirmed;
    setSaving(true);
    try {
      await fetch(
        `https://klvotqhinoapghxinrmy.supabase.co/rest/v1/orders?id=eq.${order.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: "sb_publishable_OJn9yxGI168WN4T5jb7nSQ_G-GhJHFD",
            Authorization: "Bearer sb_publishable_OJn9yxGI168WN4T5jb7nSQ_G-GhJHFD",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ deposit_paid: next }),
        }
      );
      setConfirmed(next);
      updateDeposit(order.id, next);
    } catch (e: any) {
      Alert.alert("Ошибка", e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F9FAFB" }}>
      <Text style={{ color: "#9CA3AF", fontSize: 14 }}>Предоплата подтверждена</Text>
      <Pressable
        onPress={toggle}
        disabled={saving}
        style={{
          flexDirection: "row", alignItems: "center",
          backgroundColor: confirmed ? "#DCFCE7" : "#FEF2F2",
          paddingHorizontal: 12, paddingVertical: 6,
          borderRadius: 20,
        }}
      >
        {saving ? (
          <ActivityIndicator size="small" color={confirmed ? "#16A34A" : "#EF4444"} />
        ) : (
          <>
            <Text style={{ fontSize: 13, fontWeight: "700", color: confirmed ? "#16A34A" : "#EF4444" }}>
              {confirmed ? "✅ Подтверждена" : "❌ Не подтверждена"}
            </Text>
            <Text style={{ fontSize: 11, color: confirmed ? "#16A34A" : "#EF4444", marginLeft: 6 }}>
              {confirmed ? "Отменить" : "Подтвердить"}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
};

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
            <Row label="Цвет ткани" value={order.fabricColor} />
            <Row label="Тип ткани" value={order.fabricType} />
            <Row label="Количество" value={order.quantity ? `${order.quantity} шт.` : "—"} />
            <Row label="Повод" value={order.occasion} />
            <Row label="Нужен к" value={order.desiredDate} />
            <Row label="Доставка" value={order.deliveryMethod} />
          </Card>

          {/* Measurements */}
          <SectionTitle>Мерки (см)</SectionTitle>
          <Card>
            <Row label="Рост" value={order.measurements?.height || "—"} />
            <Row label="Грудь" value={order.measurements?.chest || "—"} />
            <Row label="Талия" value={order.measurements?.waist || "—"} />
            <Row label="Бёдра" value={order.measurements?.hips || "—"} />
          </Card>

          {/* Comment */}
          {order.comment ? (
            <>
              <SectionTitle>Комментарий клиента</SectionTitle>
              <Card>
                <View style={{ paddingVertical: 12 }}>
                  <Text style={{ color: "#374151", fontSize: 14, lineHeight: 20 }}>{order.comment}</Text>
                </View>
              </Card>
            </>
          ) : null}

          {/* Reference photo */}
          {order.referencePhotoUrl ? (
            <>
              <SectionTitle>Фото модели (образец клиента)</SectionTitle>
              <Card>
                <Image
                  source={{ uri: order.referencePhotoUrl }}
                  style={{ width: "100%", height: 220, borderRadius: 12 }}
                  resizeMode="cover"
                />
              </Card>
            </>
          ) : null}

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
            <DepositToggle order={order} />
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
  active: OrderStatus | "Все" | "Оплачено" | "Не оплачено";
  onChange: (f: OrderStatus | "Все" | "Оплачено" | "Не оплачено") => void;
}) => {
  const filters: (OrderStatus | "Все" | "Оплачено" | "Не оплачено")[] = ["Все", ...STATUS_ORDER, "Оплачено", "Не оплачено"];
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
      <View style={{ paddingTop: 56, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
        <Text style={{ fontSize: 24, fontWeight: "700", color: "#111827" }}>Заказы</Text>
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
