import { Controller } from "react-hook-form";
import { View, Text, Pressable, TextInput } from "react-native";

interface MultiChipSelectorProps {
  control: any;
  name: string;
  options: string[];
  /** When true, the whole selector is greyed out and non-interactive */
  disabled?: boolean;
  /** If true, selecting "Другое"/"Басқа" shows a free-text input */
  allowCustom?: boolean;
  /** Field name to store the custom text (defaults to `${name}Custom`) */
  customName?: string;
}

const OTHER_VALUES = ["Другое", "Басқа"];

export const MultiChipSelector = ({
  control,
  name,
  options,
  disabled = false,
  allowCustom = false,
  customName,
}: MultiChipSelectorProps) => {
  const resolvedCustomName = customName ?? `${name}Custom`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value = [] } }) => (
        <View style={{ opacity: disabled ? 0.4 : 1 }}>
          {disabled && (
            <Text
              style={{
                fontSize: 11,
                color: "#9CA3AF",
                marginBottom: 6,
                fontStyle: "italic",
              }}
            >
              Сначала выберите орнамент
            </Text>
          )}

          <View className="flex-row flex-wrap mb-1">
            {options.map((opt: string) => {
              const isSelected = value.includes(opt);
              return (
                <Pressable
                  key={opt}
                  disabled={disabled}
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
                      isSelected ? "text-[#C5A059] font-bold" : "text-gray-400"
                    }
                  >
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Custom text input when "Другое" is selected */}
          {allowCustom && value.some((v: string) => OTHER_VALUES.includes(v)) && (
            <Controller
              control={control}
              name={resolvedCustomName}
              render={({ field: { onChange: onCustomChange, value: customValue } }) => (
                <TextInput
                  value={customValue ?? ""}
                  onChangeText={onCustomChange}
                  placeholder="Введите своё расположение..."
                  placeholderTextColor="#C1C1C1"
                  editable={!disabled}
                  style={{
                    borderWidth: 1,
                    borderColor: "#C5A059",
                    borderRadius: 12,
                    padding: 12,
                    fontSize: 14,
                    color: "#1F2937",
                    backgroundColor: "white",
                    marginBottom: 8,
                  }}
                />
              )}
            />
          )}
        </View>
      )}
    />
  );
};
