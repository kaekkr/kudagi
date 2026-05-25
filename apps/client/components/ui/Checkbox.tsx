import { View, Text, Pressable } from "react-native";
import { Controller, useFormContext } from "react-hook-form";

export const Checkbox = ({ name, text, rules }: any) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="mb-4">
          <Pressable
            onPress={() => onChange(!value)}
            className="flex-row items-start"
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 1.5,
                borderColor: error ? "#F87171" : value ? "#C5A059" : "#D1D5DB",
                backgroundColor: value ? "#C5A059" : "transparent",
                marginRight: 10,
                marginTop: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {value && (
                <Text style={{ color: "white", fontSize: 11, fontWeight: "700" }}>
                  ✓
                </Text>
              )}
            </View>

            <Text className="text-sm text-gray-600 flex-1">{text}</Text>
          </Pressable>

          {error && (
            <Text style={{ color: "#F87171", fontSize: 11, marginTop: 4 }}>
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
};