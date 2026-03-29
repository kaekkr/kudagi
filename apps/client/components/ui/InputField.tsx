import { Controller } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
} from "react-native";

export const InputField = ({ control, name, placeholder, rules, ...props }: any) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <View className="mb-3">
        <TextInput
          className={`bg-white border p-4 rounded-xl text-gray-800 ${error ? "border-red-300" : "border-gray-100"}`}
          placeholder={placeholder}
          placeholderTextColor="#C1C1C1"
          value={value}
          onChangeText={onChange}
          {...props}
        />
        {error && <Text className="text-red-400 text-xs mt-1 ml-1">{error.message}</Text>}
      </View>
    )}
  />
);
