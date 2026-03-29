import { useState } from "react";
import {
  View,
  Text,
  Pressable,
} from "react-native";

export const PaymentView = ({ data, onComplete, onWhatsApp }: any) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFakePay = () => {
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); onComplete(); }, 2000);
  };

  return (
    <View className="p-6 bg-white rounded-3xl shadow-xl">
      <Text className="text-xl font-bold mb-1 text-center">Подтверждение заказа</Text>
      <Text className="text-gray-400 text-xs text-center mb-5">
        {data.clientName} · {data.garmentModel} · {data.quantity} шт. · {data.orderType}
      </Text>

      {data.paymentMethod === "Kaspi Перевод" && (
        <View className="items-center">
          <Text className="text-gray-600 text-center mb-3">
            Менеджер свяжется с вами и сообщит точную стоимость.{"\n"}После чего переведите предоплату 50%:
          </Text>
          <View className="bg-gray-100 p-4 rounded-2xl mb-4 w-full">
            <Text className="text-lg font-bold text-center">+7 (707) 284-74-07</Text>
            <Text className="text-xs text-gray-400 text-center">Получатель: Мадина К.</Text>
          </View>
          <Pressable onPress={onWhatsApp} className="bg-[#25D366] w-full p-4 rounded-xl items-center mb-3">
            <Text className="text-white font-bold">Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={onComplete} className="bg-[#C5A059] w-full p-4 rounded-xl items-center">
            <Text className="text-white font-bold">Завершить оформление</Text>
          </Pressable>
        </View>
      )}

      {(data.paymentMethod === "Kaspi QR" || data.paymentMethod === "Kaspi Red") && (
        <View className="items-center">
          <View className="w-48 h-48 bg-gray-50 border-2 border-[#E11D48] rounded-3xl items-center justify-center mb-4">
            <Text className="text-[#E11D48] font-bold">KASPI</Text>
          </View>
          <Pressable onPress={onWhatsApp} className="bg-[#25D366] w-full p-4 rounded-xl items-center mb-3">
            <Text className="text-white font-bold">Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={handleFakePay} className="bg-[#E11D48] w-full p-4 rounded-xl items-center">
            <Text className="text-white font-bold">
              {isProcessing ? t.checking : t.confirmPayment}
            </Text>
          </Pressable>
        </View>
      )}

      {data.paymentMethod === "Банковский перевод" && (
        <View className="items-center">
          <Text className="text-gray-600 text-center mb-4">
            Менеджер пришлёт реквизиты для перевода после подтверждения заказа.
          </Text>
          <Pressable onPress={onWhatsApp} className="bg-[#25D366] w-full p-4 rounded-xl items-center mb-3">
            <Text className="text-white font-bold">Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={onComplete} className="bg-[#C5A059] w-full p-4 rounded-xl items-center">
            <Text className="text-white font-bold">Завершить оформление</Text>
          </Pressable>
        </View>
      )}

      {data.paymentMethod === "Наличные" && (
        <View className="items-center py-2">
          <Text className="text-gray-600 text-center mb-4">
            Оплата наличными при получении или в ателье.
          </Text>
          <Pressable onPress={onWhatsApp} className="bg-[#25D366] w-full p-4 rounded-xl items-center mb-3">
            <Text className="text-white font-bold">Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={onComplete} className="bg-[#C5A059] w-full p-4 rounded-xl items-center">
            <Text className="text-white font-bold">Завершить оформление</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};
