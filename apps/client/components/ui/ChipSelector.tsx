import { Controller } from "react-hook-form";
import { View, Text, Pressable, TextInput } from "react-native";

interface ChipSelectorProps {
  control: any;
  name: string;
  options: string[];
  /** If true, selecting "Другое"/"Басқа" shows a free-text input */
  allowCustom?: boolean;
  /** Field name to store the custom text (defaults to `${name}Custom`) */
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
    <View className="mb-3">
      <View className="flex-row flex-wrap">
        {options.map((opt: string) => (
          <Controller
            key={opt}
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
              <Pressable
                onPress={() => onChange(opt)}
                className={`mr-2 mb-2 px-4 py-2.5 rounded-xl border ${
                  value === opt
                    ? "border-[#C5A059] bg-[#C5A059]/10"
                    : "border-gray-100 bg-white"
                }`}
              >
                <Text
                  className={
                    value === opt ? "text-[#C5A059] font-bold" : "text-gray-400"
                  }
                >
                  {opt}
                </Text>
              </Pressable>
            )}
          />
        ))}
      </View>

      {/* Custom text input when "Другое" is selected */}
      {allowCustom && (
        <Controller
          control={control}
          name={name}
          render={({ field: { value: selected } }) =>
            OTHER_VALUES.includes(selected) ? (
              <Controller
                control={control}
                name={resolvedCustomName}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value ?? ""}
                    onChangeText={onChange}
                    placeholder="Введите своё название..."
                    placeholderTextColor="#C1C1C1"
                    style={{
                      borderWidth: 1,
                      borderColor: "#C5A059",
                      borderRadius: 12,
                      padding: 12,
                      fontSize: 14,
                      color: "#1F2937",
                      backgroundColor: "white",
                      marginTop: 4,
                    }}
                  />
                )}
              />
            ) : null
          }
        />
      )}
    </View>
  );
};
