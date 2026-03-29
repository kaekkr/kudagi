import { View, Text, Pressable, TextInput } from "react-native";
import { Control, Controller } from "react-hook-form";
import { Ruler } from "lucide-react-native";

// UI Components
import { InputField } from "./ui/InputField";
import { SectionLabel } from "./ui/SectionLabel";
import { ChipSelector } from "./ui/ChipSelector";
import { Checkbox } from "./ui/Checkbox";

// Constants
import { KU_GOLD, OCCASIONS, DELIVERY_METHODS } from "@/constants/orderConstants";

interface StepThreeProps {
  t: any;
  control: Control<any>;
  lang: string;
  method: string;
}

export const StepThree = ({ t, control, lang, method }: StepThreeProps) => {
  // We define this inside to access 'lang' for labels
  const MEASUREMENT_FIELDS = [
    { name: "chest", abbr: "Ог", label: lang === "kaz" ? "Кеуде өлшемі" : "Обхват груди" },
    { name: "waist", abbr: "От", label: lang === "kaz" ? "Бел өлшемі" : "Обхват талии" },
    { name: "hips", abbr: "Об", label: lang === "kaz" ? "Жамбас өлшемі" : "Обхват бедер" },
    { name: "chestHeight", abbr: "Вг", label: lang === "kaz" ? "Кеуде биіктігі" : "Высота груди" },
    { name: "backWidth", abbr: "Шсп", label: lang === "kaz" ? "Арқа ені" : "Ширина спинки" },
    { name: "frontLength", abbr: "Дтп", label: lang === "kaz" ? "Алдыңғы ұзындық" : "Длина полочки" },
    { name: "backLength", abbr: "Дтс", label: lang === "kaz" ? "Арқа ұзындығы" : "Длина спинки" },
    { name: "shoulderLength", abbr: "Дплеча", label: lang === "kaz" ? "Иық ұзындығы" : "Длина плеча" },
    { name: "skirtLength", abbr: "Дю", label: lang === "kaz" ? "Юбка ұзындығы" : "Длина юбки" },
    { name: "garmentLength", abbr: "Дизд", label: lang === "kaz" ? "Бұйым ұзындығы" : "Длина изделия" },
    { name: "armCircumference", abbr: "Орук", label: lang === "kaz" ? "Қол өлшемі" : "Обхват руки" },
    { name: "sleeveLength", abbr: "Д рук", label: lang === "kaz" ? "Жең ұзындығы" : "Длина рукавов" },
    { name: "neckCircumference", abbr: "Шея", label: lang === "kaz" ? "Мойын өлшемі" : "Обхват шеи" },
    { name: "height", abbr: "Бой", label: lang === "kaz" ? "Бойы" : "Рост" },
  ];

  return (
    <View>
      <Text className="text-3xl font-bold mb-1">{t.newOrder}</Text>
      <Text className="text-gray-400 mb-6">{t.step3title}</Text>

      {/* Header for Measurements */}
      <View className="flex-row items-center mb-3">
        <Ruler size={18} color={KU_GOLD} />
        <Text className="ml-2 font-semibold text-gray-800">Мерки клиента (см)</Text>
      </View>

      {/* Measurement Method Toggle */}
      <View className="flex-row mb-4">
        {[
          { value: "самостоятельно", label: t.selfMeasure },
          { value: "мастер", label: t.masterMeasure },
        ].map((m) => (
          <Controller
            key={m.value}
            control={control}
            name="measurementMethod"
            render={({ field: { onChange, value } }) => (
              <Pressable onPress={() => onChange(m.value)} className="flex-row items-center mr-6">
                <View
                  className={`w-4 h-4 rounded-full border mr-2 ${
                    value === m.value ? "bg-[#C5A059] border-[#C5A059]" : "border-gray-300"
                  }`}
                />
                <Text className="text-xs text-gray-600">{m.label}</Text>
              </Pressable>
            )}
          />
        ))}
      </View>

      {/* Dynamic Measurement Inputs Grid */}
      {method === "самостоятельно" && (
        <View className="flex-row flex-wrap justify-between mb-2">
          {MEASUREMENT_FIELDS.map((f) => (
            <View key={f.name} className="w-[48%] mb-3">
              <View className="flex-row items-center mb-1">
                <View className="bg-[#C5A059] rounded-md px-1.5 py-0.5 mr-1.5">
                  <Text className="text-white text-[9px] font-bold">{f.abbr}</Text>
                </View>
                <Text className="text-xs text-gray-500 flex-1" numberOfLines={1}>
                  {f.label}
                </Text>
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
                    onChangeText={onChange}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
          ))}
        </View>
      )}

      {/* Additional Details */}
      <SectionLabel>{t.occasion}</SectionLabel>
      <ChipSelector control={control} name="occasion" options={OCCASIONS} />

      <SectionLabel>{t.desiredDate}</SectionLabel>
      <InputField control={control} name="desiredDate" placeholder={t.desiredDate} rules={{ required: t.errorDate }} />

      <Checkbox
        control={control}
        name="deadlineConfirmed"
        text={t.confirmDeadline}
        rules={{ required: t.errorDeadline }}
      />

      <SectionLabel>{t.deliveryMethod}</SectionLabel>
      <ChipSelector control={control} name="deliveryMethod" options={DELIVERY_METHODS} />

      <SectionLabel>{t.comment}</SectionLabel>
      <InputField
        control={control}
        name="comment"
        placeholder={t.commentPlaceholder}
        multiline
        numberOfLines={3}
        style={{ minHeight: 80, textAlignVertical: "top" }}
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
