import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { usePriceStore } from "@kudagi/core";
import { calculatePrice } from "@/utils/priceCalculator";

const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₸";

export const PaymentView = ({ data, onComplete, onWhatsApp }: any) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { prices, ornamentPrices } = usePriceStore();
  const breakdown = calculatePrice(data, prices, ornamentPrices);
  const hasPrice = breakdown.total > 0;

  const handleFakePay = () => {
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); onComplete(); }, 2000);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }} contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 4 }}>
        Подтверждение заказа
      </Text>
      <Text style={{ color: "#9CA3AF", fontSize: 12, textAlign: "center", marginBottom: 20 }}>
        {data.clientName} · {data.orderType}
      </Text>

      {/* Price summary */}
      {hasPrice && (
        <View style={{ backgroundColor: "#F9FAFB", borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Стоимость заказа
          </Text>
          {breakdown.lines.map((line, i) => (
            <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
              <Text style={{ fontSize: 13, color: "#6B7280", flex: 1, marginRight: 8 }}>{line.label}</Text>
              <Text style={{ fontSize: 13, color: "#374151", fontWeight: "600" }}>{fmt(line.amount)}</Text>
            </View>
          ))}
          <View style={{ height: 1, backgroundColor: "#E5E7EB", marginVertical: 10 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827" }}>Итого</Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827" }}>{fmt(breakdown.total)}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Предоплата 50%</Text>
            <Text style={{ fontSize: 12, color: "#C5A059", fontWeight: "600" }}>{fmt(breakdown.deposit)}</Text>
          </View>
        </View>
      )}

      {/* Payment method specific UI */}
      {data.paymentMethod === "Kaspi Перевод" && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#4B5563", textAlign: "center", marginBottom: 12 }}>
            Менеджер свяжется с вами и сообщит точную стоимость.{"\n"}После чего переведите предоплату 50%:
          </Text>
          <View style={{ backgroundColor: "#F3F4F6", padding: 16, borderRadius: 16, marginBottom: 16, width: "100%" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", textAlign: "center" }}>+7 (707) 284-74-07</Text>
            <Text style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>Получатель: Мадина К.</Text>
          </View>
          <Pressable onPress={onWhatsApp} style={{ backgroundColor: "#25D366", width: "100%", padding: 16, borderRadius: 14, alignItems: "center", marginBottom: 10 }}>
            <Text style={{ color: "white", fontWeight: "700" }}>Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={onComplete} style={{ backgroundColor: "#C5A059", width: "100%", padding: 16, borderRadius: 14, alignItems: "center" }}>
            <Text style={{ color: "white", fontWeight: "700" }}>Завершить оформление</Text>
          </Pressable>
        </View>
      )}

      {(data.paymentMethod === "Kaspi QR" || data.paymentMethod === "Kaspi Red") && (
        <View style={{ alignItems: "center" }}>
          <View style={{ width: 192, height: 192, backgroundColor: "#FFF0F3", borderWidth: 2, borderColor: "#E11D48", borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Text style={{ color: "#E11D48", fontWeight: "700", fontSize: 18 }}>KASPI</Text>
          </View>
          <Pressable onPress={onWhatsApp} style={{ backgroundColor: "#25D366", width: "100%", padding: 16, borderRadius: 14, alignItems: "center", marginBottom: 10 }}>
            <Text style={{ color: "white", fontWeight: "700" }}>Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={handleFakePay} style={{ backgroundColor: "#E11D48", width: "100%", padding: 16, borderRadius: 14, alignItems: "center" }}>
            <Text style={{ color: "white", fontWeight: "700" }}>
              {isProcessing ? "Проверка..." : "Подтвердить оплату"}
            </Text>
          </Pressable>
        </View>
      )}

      {data.paymentMethod === "Банковский перевод" && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#4B5563", textAlign: "center", marginBottom: 16 }}>
            Менеджер пришлёт реквизиты для перевода после подтверждения заказа.
          </Text>
          <Pressable onPress={onWhatsApp} style={{ backgroundColor: "#25D366", width: "100%", padding: 16, borderRadius: 14, alignItems: "center", marginBottom: 10 }}>
            <Text style={{ color: "white", fontWeight: "700" }}>Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={onComplete} style={{ backgroundColor: "#C5A059", width: "100%", padding: 16, borderRadius: 14, alignItems: "center" }}>
            <Text style={{ color: "white", fontWeight: "700" }}>Завершить оформление</Text>
          </Pressable>
        </View>
      )}

      {data.paymentMethod === "Наличные" && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#4B5563", textAlign: "center", marginBottom: 16 }}>
            Оплата наличными при получении или в ателье.
          </Text>
          <Pressable onPress={onWhatsApp} style={{ backgroundColor: "#25D366", width: "100%", padding: 16, borderRadius: 14, alignItems: "center", marginBottom: 10 }}>
            <Text style={{ color: "white", fontWeight: "700" }}>Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={onComplete} style={{ backgroundColor: "#C5A059", width: "100%", padding: 16, borderRadius: 14, alignItems: "center" }}>
            <Text style={{ color: "white", fontWeight: "700" }}>Завершить оформление</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};
