import { View, Text, Pressable, TextInput } from "react-native";
import { Control, Controller, useWatch } from "react-hook-form";
import { Ruler } from "lucide-react-native";

import { SectionLabel } from "./ui/SectionLabel";
import { ChipSelector } from "./ui/ChipSelector";
import { Checkbox } from "./ui/Checkbox";
// Импортируем локализованные константы и типы
import {
  OCCASIONS_T,
  DELIVERY_METHODS_T,
  Lang
} from "@/constants/translations";
import { KU_GOLD } from "@/constants/orderConstants";

interface StepThreeProps {
  t: any;
  control: Control<any>;
  lang: Lang;
}

// Вспомогательные функции масок остаются прежними
function applyDateMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").substring(0, 8);
  let result = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) result += ".";
    result += digits[i];
  }
  return result;
}

function applyNumericMask(raw: string): string {
  return raw.replace(/\D/g, "").substring(0, 5);
}

export const StepThree = ({ t, control, lang }: StepThreeProps) => {
  const method = useWatch({
      control,
      name: "measurementMethod",
      defaultValue: "самостоятельно",
    });

  // Динамический массив мерок, который зависит от текущего языка
  const MEASUREMENT_FIELDS = [
    { name: "chest",            abbr: "Ог",     label: lang === "kaz" ? "Кеуде өлшемі"     : "Обхват груди" },
    { name: "waist",            abbr: "От",     label: lang === "kaz" ? "Бел өлшемі"        : "Обхват талии" },
    { name: "hips",             abbr: "Об",     label: lang === "kaz" ? "Жамбас өлшемі"     : "Обхват бедер" },
    { name: "chestHeight",      abbr: "Вг",     label: lang === "kaz" ? "Кеуде биіктігі"    : "Высота груди" },
    { name: "backWidth",        abbr: "Шсп",    label: lang === "kaz" ? "Арқа ені"          : "Ширина спинки" },
    { name: "frontLength",      abbr: "Дтп",    label: lang === "kaz" ? "Алдыңғы ұзындық"  : "Длина полочки" },
    { name: "backLength",       abbr: "Дтс",    label: lang === "kaz" ? "Арқа ұзындығы"    : "Длина спинки" },
    { name: "shoulderLength",   abbr: "Дплеча", label: lang === "kaz" ? "Иық ұзындығы"     : "Длина плеча" },
    { name: "skirtLength",      abbr: "Дю",     label: lang === "kaz" ? "Юбка ұзындығы"    : "Длина юбки" },
    { name: "garmentLength",    abbr: "Дизд",   label: lang === "kaz" ? "Бұйым ұзындығы"   : "Длина изделия" },
    { name: "armCircumference", abbr: "Орук",   label: lang === "kaz" ? "Қол өлшемі"       : "Обхват руки" },
    { name: "sleeveLength",     abbr: "Д рук",  label: lang === "kaz" ? "Жең ұзындығы"     : "Длина рукавов" },
    { name: "neckCircumference", abbr: "Шея",    label: lang === "kaz" ? "Мойын өлшемі"     : "Обхват шеи" },
    { name: "height",           abbr: "Бой",    label: lang === "kaz" ? "Бойы"              : "Рост" },
  ];

  return (
    <View>
      <Text className="text-3xl font-bold mb-1">{t.newOrder}</Text>
      <Text className="text-gray-400 mb-6">{t.step3title}</Text>

      {/* Заголовок мерок */}
      <View className="flex-row items-center mb-3">
        <Ruler size={18} color={KU_GOLD} />
        <Text className="ml-2 font-semibold text-gray-800">{t.measurements}</Text>
      </View>

      {/* Переключатель способа снятия мерок */}
      <Controller
        control={control}
        name="measurementMethod"
        render={({ field: { onChange, value } }) => (
          <View className="flex-row mb-4">
            {[
              { value: "самостоятельно", label: t.selfMeasure },
              { value: "мастер",         label: t.masterMeasure },
            ].map((m) => (
              <Pressable
                key={m.value}
                onPress={() => onChange(m.value)} // Теперь это один и тот же onChange
                className="flex-row items-center mr-6"
              >
                <View
                  style={{
                    width: 16, height: 16, borderRadius: 8, borderWidth: 1.5,
                    borderColor: value === m.value ? "#C5A059" : "#D1D5DB",
                    backgroundColor: value === m.value ? "#C5A059" : "transparent",
                    marginRight: 8,
                  }}
                />
                <Text className="text-xs text-gray-600">{m.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      />

      {/* Поля ввода мерок */}
      {method === "самостоятельно" && (
        <View className="flex-row flex-wrap justify-between mb-2">
          {MEASUREMENT_FIELDS.map((f) => (
            <View key={f.name} className="w-[48%] mb-3">
              <View className="flex-row items-center mb-1">
                <View style={{
                  backgroundColor: "#C5A059", borderRadius: 6,
                  paddingHorizontal: 6, paddingVertical: 2, marginRight: 6,
                }}>
                  <Text style={{ color: "white", fontSize: 9, fontWeight: "700" }}>{f.abbr}</Text>
                </View>
                <Text className="text-xs text-gray-500 flex-1" numberOfLines={1}>{f.label}</Text>
              </View>
              <Controller
                control={control}
                name={f.name as any}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-white border border-gray-100 p-3 rounded-xl text-gray-800 text-sm"
                    placeholder="0"
                    placeholderTextColor="#C1C1C1"
                    value={value}
                    onChangeText={(text) => onChange(applyNumericMask(text))}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                )}
              />
            </View>
          ))}
        </View>
      )}

      <SectionLabel>{t.occasion}</SectionLabel>
      <ChipSelector
        control={control}
        name="occasion"
        options={OCCASIONS_T[lang]}
      />

      <SectionLabel>{t.desiredDate}</SectionLabel>
      <Controller
        control={control}
        name="desiredDate"
        rules={{ required: t.errorDate }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="mb-3">
            <TextInput
              className={`bg-white border p-4 rounded-xl text-gray-800 ${error ? "border-red-300" : "border-gray-100"}`}
              placeholder={lang === "kaz" ? "кк.аа.жжжж" : "дд.мм.гггг"}
              placeholderTextColor="#C1C1C1"
              value={value}
              onChangeText={(text) => onChange(applyDateMask(text))}
              keyboardType="numeric"
              maxLength={10}
            />
            {error && <Text className="text-red-400 text-xs mt-1 ml-1">{error.message}</Text>}
          </View>
        )}
      />

      <Checkbox
        control={control}
        name="deadlineConfirmed"
        text={t.confirmDeadline}
        rules={{ required: t.errorDeadline }}
      />

      <SectionLabel>{t.deliveryMethod}</SectionLabel>
      <ChipSelector
        control={control}
        name="deliveryMethod"
        options={DELIVERY_METHODS_T[lang]}
      />

      <SectionLabel>{t.comment}</SectionLabel>
      <Controller
        control={control}
        name="comment"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="bg-white border border-gray-100 p-4 rounded-xl text-gray-800 mb-3"
            placeholder={t.commentPlaceholder}
            placeholderTextColor="#C1C1C1"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={3}
            style={{ minHeight: 80, textAlignVertical: "top" }}
          />
        )}
      />

      <Checkbox
        control={control}
        name="confirmData"
        text={t.confirmData}
        rules={{ required: t.errorConfirmData }}
      />
    </View>
  );
};
