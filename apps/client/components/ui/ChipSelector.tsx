import { Controller } from "react-hook-form";
import { View, Text, Pressable, TextInput } from "react-native";

interface ChipSelectorProps {
  control: any;
  name: string;
  options: string[];
  allowCustom?: boolean;
  customName?: string;
}

const OTHER_VALUES = ["Другое", "Басқа"];

export const ChipSelector = ({
  control,
  name,
  options,
  allowCustom = false,
  customName,
}: ChipSelectorProps) => {
  const resolvedCustomName = customName ?? `${name}Custom`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const selected = value;

        return (
          <View className="mb-3">
            <View className="flex-row flex-wrap">
              {options.map((opt) => {
                const isSelected = selected === opt;

                return (
                  <Pressable
                    key={opt}
                    onPress={() => onChange(opt)}
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

            {/* custom input */}
            {allowCustom && OTHER_VALUES.includes(selected) && (
              <Controller
                control={control}
                name={resolvedCustomName}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value ?? ""}
                    onChangeText={onChange}
                    placeholder="Введите своё название..."
                    style={{
                      borderWidth: 1,
                      borderColor: "#C5A059",
                      borderRadius: 12,
                      padding: 12,
                      marginTop: 6,
                    }}
                  />
                )}
              />
            )}
          </View>
        );
      }}
    />
  );
};