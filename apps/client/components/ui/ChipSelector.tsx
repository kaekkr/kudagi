import { Controller } from "react-hook-form";
import {
  View,
  Text,
  Pressable
} from "react-native";

export const ChipSelector = ({ control, name, options }: any) => (
  <View className="flex-row flex-wrap mb-3">
    {options.map((opt: string) => (
      <Controller
        key={opt}
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Pressable
            onPress={() => onChange(opt)}
            className={`mr-2 mb-2 px-4 py-2.5 rounded-xl border ${
              value === opt ? "border-[#C5A059] bg-[#C5A059]/10" : "border-gray-100 bg-white"
            }`}
          >
            <Text className={value === opt ? "text-[#C5A059] font-bold" : "text-gray-400"}>
              {opt}
            </Text>
          </Pressable>
        )}
      />
    ))}
  </View>
);
