import React from "react";
import { View, Text, Pressable } from "react-native";
import { Lang } from "@/constants/translations";

interface FormHeaderProps {
  step: number;
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const FormHeader = ({ step, lang, setLang }: FormHeaderProps) => {
  return (
    <View className="mt-4">
      {/* Language Switcher */}
      <View className="flex-row justify-end px-6">
        <Pressable
          onPress={() => setLang(lang === "kaz" ? "rus" : "kaz")}
          className="flex-row items-center bg-gray-100 rounded-full px-3 py-1.5"
        >
          <Text className="text-[10px] font-bold text-gray-600">
            {lang === "kaz" ? "RU" : "KZ"}
          </Text>
        </Pressable>
      </View>

      {/* Progress Bar */}
      <View className="flex-row px-6 mt-4">
        {[1, 2, 3, 4].map((s) => (
          <View
            key={s}
            className={`h-1.5 flex-1 mx-1 rounded-full ${
              s <= step ? "bg-[#C5A059]" : "bg-gray-100"
            }`}
          />
        ))}
      </View>
    </View>
  );
};
