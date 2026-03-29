import {
  View,
  Text,
  Pressable,
} from "react-native";

export const SuccessScreen = ({ onReset }: { onReset: () => void }) => (
  <View className="flex-1 items-center justify-center p-6">
    <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
      <Text className="text-green-600 text-3xl">✓</Text>
    </View>
    <Text className="text-2xl font-bold text-center mb-2">Заказ принят!</Text>
    <Text className="text-gray-500 text-center mb-8">
      Мадина свяжется с вами в ближайшее время для подтверждения деталей и стоимости.
    </Text>
    <Pressable onPress={onReset} className="bg-[#C5A059] px-10 py-4 rounded-2xl">
      <Text className="text-white font-bold">Создать новый заказ</Text>
    </Pressable>
  </View>
);
