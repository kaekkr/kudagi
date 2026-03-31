import { View, Text } from "react-native";

interface BadgeProps {
  text: string;
  color: string;      // Tailwind класс фона, например 'bg-green-100'
  textColor: string;  // Tailwind класс текста, например 'text-green-700'
  borderColor?: string; // Опционально: класс рамки
}

export const Badge = ({ text, color, textColor, borderColor = "" }: BadgeProps) => (
  <View className={`${color} ${borderColor ? `border ${borderColor}` : ""} px-2 py-1 rounded-md flex-row items-center`}>
    <Text className={`${textColor} text-[10px] font-bold uppercase`}>
      {text}
    </Text>
  </View>
);
