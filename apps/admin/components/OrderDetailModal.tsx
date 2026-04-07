import { KuDagiOrder, OrderStatus, useOrderStore } from "@kudagi/core";
import { useState } from "react";
import { Modal, Pressable, View, Text, ScrollView, Image } from "react-native";
import { SectionTitle } from "./ui/SectionTitle";
import { Card } from "./ui/Card";
import { Row } from "./ui/Row";
import { formatDate } from "@/utils/formatDate";
import { STATUS_ORDER } from "@/constants/constants";
import { PaymentControls } from "./PaymentControls";

export const OrderDetailModal = ({
  order,
  onClose,
}: {
  order: KuDagiOrder;
  onClose: () => void;
}) => {
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const updateOrderPayment = useOrderStore(s => s.updateOrderPayment);
  const [selected, setSelected] = useState<OrderStatus>(order.status);

  const handleSave = async () => {
    try {
      if (selected !== order.status) {
        await updateOrderStatus(order.id, selected);
      }
    } catch (e) {
      console.error("Failed to save status", e);
    } finally {
      onClose();
    }
  };

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-100">
          <View className="flex-1 mr-4">
            <Text className="text-lg font-bold" numberOfLines={1}>
              {order.clientName}
            </Text>
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
            {order.contactPerson && <Row label="Контактное лицо" value={order.contactPerson} />}
            <Row label="Город" value={order.city} />
            <Row label="Адрес" value={order.address} />
          </Card>

          {/* Детали заказа */}
          <SectionTitle>Заказ</SectionTitle>
          <Card>
            <Row label="Модель" value={order.garmentModel} />
            <Row label="Вид заказа" value={order.orderType} />
            <Row
              label="Орнамент"
              value={order.ornamentType?.join(", ") || "-"}
            />
            <Row
              label="Расположение"
              value={order.ornamentPosition?.join(", ") || "-"}
            />
            <Row label="Цвет ниток" value={order.embroideryColor} />
            <Row label="Цвет ткани" value={order.fabricColor} />
            <Row label="Тип ткани" value={order.fabricType} />
            <Row label="Количество" value={order.quantity ? `${order.quantity} шт.` : "—"} />
            <Row label="Повод" value={order.occasion} />
            <Row label="Нужен к" value={order.desiredDate} />
            <Row label="Доставка" value={order.deliveryMethod} />
          </Card>

          {/* Полная сетка мерок */}
          <SectionTitle>Мерки (см)</SectionTitle>
          <Card>
            <Row label="Рост" value={order.measurements?.height} />
            <Row label="Обхват груди (Ог)" value={order.measurements?.chest} />
            <Row label="Обхват талии (От)" value={order.measurements?.waist} />
            <Row label="Обхват бедер (Об)" value={order.measurements?.hips} />
            <Row label="Высота груди (Вг)" value={order.measurements?.chestHeight} />
            <Row label="Ширина спинки (Шсп)" value={order.measurements?.backWidth} />
            <Row label="Длина полочки (Дтп)" value={order.measurements?.frontLength} />
            <Row label="Длина спинки (Дтс)" value={order.measurements?.backLength} />
            <Row label="Длина плеча" value={order.measurements?.shoulderLength} />
            <Row label="Обхват шеи" value={order.measurements?.neckCircumference} />
            <Row label="Обхват руки" value={order.measurements?.armCircumference} />
            <Row label="Длина рукава" value={order.measurements?.sleeveLength} />
            <Row label="Длина юбки" value={order.measurements?.skirtLength} />
            <Row label="Длина изделия" value={order.measurements?.garmentLength} />
          </Card>

          {/* Комментарий */}
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

          {/* Фото-референс */}
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

          {/* Оплата */}
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
                    ...(flags.full !== undefined && { fullPaid: flags.full }),
                  });
                }}
              />
            </View>
          </Card>

          {/* Статус */}
          <SectionTitle>Статус производства</SectionTitle>
          <Card>
            <Text className="text-[10px] text-gray-400 mb-3 uppercase tracking-tighter">
              Последнее обновление: {formatDate(order.statusUpdatedAt)}
            </Text>
            <View className="flex-row flex-wrap">
              {STATUS_ORDER.map((s) => {
                const isFinancialStatus = s === "Предоплата оплачена" || s === "Оплачено полностью";
                if (isFinancialStatus) return null;

                const active = selected === s;
                return (
                  <Pressable
                    key={s}
                    onPress={() => setSelected(s)}
                    className={`mr-2 mb-2 px-3 py-2 rounded-lg border ${
                      active ? "border-[#C5A059] bg-[#C5A059]/10" : "border-gray-100 bg-white"
                    }`}
                  >
                    <Text className={`text-xs font-medium ${active ? "text-[#C5A059]" : "text-gray-500"}`}>
                      {s}
                    </Text>
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
