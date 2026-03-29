import {
  View,
  Text,
  Pressable,
} from "react-native";
import { Controller } from "react-hook-form";

export const Checkbox = ({ control, name, text, rules }: any) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <View className="mb-4">
        <Pressable onPress={() => onChange(!value)} className="flex-row items-start">
          <View
            className={`w-5 h-5 rounded border mr-3 mt-0.5 items-center justify-center flex-shrink-0 ${
              error ? "border-red-400" : value ? "bg-[#C5A059] border-[#C5A059]" : "border-gray-200"
            }`}
          >
            {value && <Text className="text-white text-[10px]">✓</Text>}
          </View>
          <Text className="text-sm text-gray-600 flex-1">{text}</Text>
        </Pressable>
        {error && <Text className="text-red-400 text-xs mt-1 ml-8">{error.message}</Text>}
      </View>
    )}
  />
);
