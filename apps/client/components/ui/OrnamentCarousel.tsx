import { Controller } from "react-hook-form";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image
} from "react-native";

export const OrnamentCarousel = ({ control, name, ornamentList, getOrnamentImage }: any) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
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
          const isSelected = value === type;
          return (
            <Pressable
              key={type}
              onPress={() => onChange(type)}
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
    )}
  />
);
