import { Controller } from "react-hook-form";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image
} from "react-native";

const OrnamentInner = ({
  value,
  onChange,
  ornamentList,
  getOrnamentImage,
}: {
  value: string[];
  onChange: (val: string[]) => void;
  ornamentList: any[];
  getOrnamentImage: (type: string) => any;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 4 }}
    className="py-2"
    nestedScrollEnabled
    directionalLockEnabled
    keyboardShouldPersistTaps="handled"
    alwaysBounceHorizontal
    bounces
  >
    {ornamentList.map((type) => {
      const isSelected = value?.includes(type);
      return (
        <Pressable
          key={type}
          onPress={() => {
            if (value?.includes(type)) {
              onChange(value.filter((item: string) => item !== type));
            } else {
              onChange([...(value || []), type]);
            }
          }}
          delayPressIn={50}
          className="mr-4 items-center w-24"
        >
          <View
            className={`w-24 h-24 rounded-2xl overflow-hidden border-2 mb-2 ${
              isSelected ? "border-[#C5A059]" : "border-gray-100"
            }`}
          >
            <Image
              source={getOrnamentImage(type)}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            {isSelected && (
              <View className="absolute top-1.5 right-1.5 bg-[#C5A059] rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-[10px]">✓</Text>
              </View>
            )}
          </View>
          <Text
            numberOfLines={1}
            className={`text-[11px] text-center w-full ${
              isSelected ? "text-[#C5A059] font-bold" : "text-gray-400"
            }`}
          >
            {type}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
);

export const OrnamentCarousel = ({
  // Mode 1: controlled via react-hook-form
  control,
  name,
  // Mode 2: direct value/onChange (for per-garment use)
  value,
  onChange,
  // Shared
  ornamentList,
  getOrnamentImage,
}: any) => {
  // Direct mode — value and onChange passed in (per-garment cards)
  if (!control) {
    return (
      <OrnamentInner
        value={value ?? []}
        onChange={onChange}
        ornamentList={ornamentList}
        getOrnamentImage={getOrnamentImage}
      />
    );
  }

  // Controller mode — original behavior
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: fieldOnChange, value: fieldValue } }) => (
        <OrnamentInner
          value={fieldValue}
          onChange={fieldOnChange}
          ornamentList={ornamentList}
          getOrnamentImage={getOrnamentImage}
        />
      )}
    />
  );
};
