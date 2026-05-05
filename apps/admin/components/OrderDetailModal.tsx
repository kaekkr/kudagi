import { KuDagiOrder, OrderStatus, PairedPerson, useOrderStore } from "@kudagi/core";
import { useState } from "react";
import { Modal, Pressable, View, Text, ScrollView, Image } from "react-native";
import { SectionTitle } from "./ui/SectionTitle";
import { Card } from "./ui/Card";
import { Row } from "./ui/Row";
import { formatDate } from "@/utils/formatDate";
import { STATUS_ORDER } from "@/constants/constants";
import { PaymentControls } from "./PaymentControls";

const MEASUREMENT_LABELS: { key: keyof PairedPerson["measurements"]; label: string }[] = [
  { key: "height",            label: "Рост" },
  { key: "chest",             label: "Обхват груди (Ог)" },
  { key: "waist",             label: "Обхват талии (От)" },
  { key: "hips",              label: "Обхват бедер (Об)" },
  { key: "chestHeight",       label: "Высота груди (Вг)" },
  { key: "backWidth",         label: "Ширина спинки (Шсп)" },
  { key: "frontLength",       label: "Длина полочки (Дтп)" },
  { key: "backLength",        label: "Длина спинки (Дтс)" },
  { key: "shoulderLength",    label: "Длина плеча" },
  { key: "neckCircumference", label: "Обхват шеи" },
  { key: "armCircumference",  label: "Обхват руки" },
  { key: "sleeveLength",      label: "Длина рукава" },
  { key: "skirtLength",       label: "Длина юбки" },
  { key: "garmentLength",     label: "Длина изделия" },
];

const KU_GOLD = "#C5A059";

const PersonCard = ({ person, label, index }: { person: PairedPerson; label: string; index: number }) => (
  <Card>
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
      <View style={{
        backgroundColor: KU_GOLD, borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 4, marginRight: 8,
      }}>
        <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>{index + 1}</Text>
      </View>
      <Text style={{ fontWeight: "600", color: "#374151", fontSize: 15 }}>{label}</Text>
    </View>
    <Row label="Модель" value={person.garmentModel} />
    <Row label="Орнамент" value={person.ornamentType?.join(", ") || "—"} />
    <Row label="Расположение" value={person.ornamentPosition?.join(", ") || "—"} />
    <View style={{ marginTop: 8, borderTopWidth: 1, borderTopColor: "#F9FAFB", paddingTop: 8 }}>
      <Text style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
        Мерки (см)
      </Text>
      {MEASUREMENT_LABELS.map(({ key, label }) =>
        person.measurements?.[key] ? (
          <Row key={key} label={label} value={person.measurements[key]} />
        ) : null
      )}
    </View>
  </Card>
);

export const OrderDetailModal = ({
  order,
  onClose,
}: {
  order: KuDagiOrder;
  onClose: () => void;
}) => {
  const updateOrderStatus  = useOrderStore((s) => s.updateOrderStatus);
  const updateOrderPayment = useOrderStore((s) => s.updateOrderPayment);
  const [selected, setSelected] = useState<OrderStatus>(order.status);

  const handleSave = async () => {
    try {
      if (selected !== order.status) await updateOrderStatus(order.id, selected);
    } catch (e) {
      console.error("Failed to save status", e);
    } finally {
      onClose();
    }
  };

  const isPaired = order.orderType === "Парный";
  const hasPerGarmentOrnaments =
    !isPaired &&
    Array.isArray(order.garmentOrnaments) &&
    order.garmentOrnaments.length > 0;

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-gray-50">
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-100">
          <View className="flex-1 mr-4">
            <Text className="text-lg font-bold" numberOfLines={1}>{order.clientName}</Text>
            {order.orderName ? (
              <Text className="text-xs text-gray-400 mt-0.5">«{order.orderName}»</Text>
            ) : null}
          </View>
          <Pressable onPress={onClose} className="p-2">
            <Text className="text-gray-400 text-xl">✕</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
          {/* Клиент */}
          <SectionTitle>Клиент</SectionTitle>
          <Card>
            <Row label="Имя" value={order.clientName} />
            <Row label="Телефон" value={order.phone} />
            <Row label="WhatsApp" value={order.whatsApp} />
            {order.contactPerson ? <Row label="Контактное лицо" value={order.contactPerson} /> : null}
            <Row label="Город" value={order.city} />
            <Row label="Адрес" value={order.address} />
          </Card>

          {/* Заказ */}
          <SectionTitle>Заказ</SectionTitle>
          <Card>
            {order.orderName ? <Row label="Название заказа" value={order.orderName} /> : null}
            <Row label="Вид заказа" value={order.orderType} />
            {!isPaired ? <Row label="Модель" value={order.garmentModel} /> : null}
            <Row label="Цвет ниток" value={order.embroideryColor} />
            <Row label="Цвет ткани" value={order.fabricColor} />
            <Row label="Тип ткани" value={order.fabricType} />
            <Row label="Повод" value={order.occasion} />
            <Row label="Нужен к" value={order.desiredDate} />
            <Row label="Доставка" value={order.deliveryMethod} />
          </Card>

          {/* Paired persons */}
          {isPaired && order.person1 && order.person2 ? (
            <>
              <SectionTitle>Изделия</SectionTitle>
              <PersonCard person={order.person1} label="Человек 1" index={0} />
              <PersonCard person={order.person2} label="Человек 2" index={1} />
            </>
          ) : hasPerGarmentOrnaments ? (
            <>
              <SectionTitle>Орнаменты</SectionTitle>
              {order.garmentOrnaments!.map((g, i) => (
                <Card key={i}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                    <View style={{
                      backgroundColor: KU_GOLD, borderRadius: 8,
                      paddingHorizontal: 10, paddingVertical: 3, marginRight: 8,
                    }}>
                      <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>#{i + 1}</Text>
                    </View>
                    <Text className="font-semibold text-gray-700">Изделие {i + 1}</Text>
                  </View>
                  <Row label="Орнамент" value={g.ornamentType?.join(", ") || "—"} />
                  <Row label="Расположение" value={g.ornamentPosition?.join(", ") || "—"} />
                </Card>
              ))}
            </>
          ) : (
            <>
              <SectionTitle>Орнаменты</SectionTitle>
              <Card>
                <Row label="Орнамент" value={order.ornamentType?.join(", ") || "—"} />
                <Row label="Расположение" value={order.ornamentPosition?.join(", ") || "—"} />
              </Card>
            </>
          )}

          {/* Standard measurements (non-paired) */}
          {!isPaired && (
            <>
              <SectionTitle>Мерки (см)</SectionTitle>
              <Card>
                {MEASUREMENT_LABELS.map(({ key, label }) => (
                  <Row key={key} label={label} value={order.measurements?.[key]} />
                ))}
              </Card>
            </>
          )}

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
              <SectionTitle>Фото модели (образец)</SectionTitle>
              <Card>
                <View className="py-2">
                  <Image
                    source={{ uri: order.referencePhotoUrl }}
                    style={{ width: "100%", height: 350, borderRadius: 12 }}
                    resizeMode="contain"
                  />
                </View>
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
              value={order.totalPrice ? `${(order.totalPrice / 2).toLocaleString("ru-RU")} ₸` : "—"}
            />
            <View className="mt-2 border-t border-gray-50 pt-2">
              <PaymentControls
                order={order}
                onPaymentChange={async (flags) => {
                  await updateOrderPayment(order.id, {
                    ...(flags.deposit !== undefined && { depositPaid: flags.deposit }),
                    ...(flags.full    !== undefined && { fullPaid:    flags.full }),
                  });
                }}
              />
            </View>
          </Card>

          {/* Status */}
          <SectionTitle>Статус производства</SectionTitle>
          <Card>
            <Text className="text-[10px] text-gray-400 mb-3 uppercase tracking-tighter">
              Последнее обновление: {formatDate(order.statusUpdatedAt)}
            </Text>
            <View className="flex-row flex-wrap">
              {STATUS_ORDER.map((s) => {
                if (s === "Предоплата оплачена" || s === "Оплачено полностью") return null;
                const active = selected === s;
                return (
                  <Pressable
                    key={s}
                    onPress={() => setSelected(s)}
                    className={`mr-2 mb-2 px-3 py-2 rounded-lg border ${active ? "border-[#C5A059] bg-[#C5A059]/10" : "border-gray-100 bg-white"}`}
                  >
                    <Text className={`text-xs font-medium ${active ? "text-[#C5A059]" : "text-gray-500"}`}>{s}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          <Pressable
            onPress={handleSave}
            className="bg-[#C5A059] p-4 rounded-2xl items-center mt-6 shadow-sm active:opacity-90"
          >
            <Text className="text-white font-bold text-base">Сохранить изменения</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
};
