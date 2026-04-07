import { Controller } from "react-hook-form";
import { View, Text, Pressable } from "react-native";

export const MultiChipSelector = ({ control, name, options }: any) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value = [] } }) => (
      <View className="flex-row flex-wrap mb-3">
        {options.map((opt: string) => {
          const isSelected = value.includes(opt);

          return (
            <Pressable
              key={opt}
              onPress={() => {
                if (isSelected) {
                  onChange(value.filter((v: string) => v !== opt));
                } else {
                  onChange([...value, opt]);
                }
              }}
              className={`mr-2 mb-2 px-4 py-2.5 rounded-xl border ${
                isSelected
                  ? "border-[#C5A059] bg-[#C5A059]/10"
                  : "border-gray-100 bg-white"
              }`}
            >
              <Text
                className={
                  isSelected
                    ? "text-[#C5A059] font-bold"
                    : "text-gray-400"
                }
              >
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    )}
  />
);
