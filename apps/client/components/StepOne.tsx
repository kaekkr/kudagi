import { View, Text, Pressable, Image, useWindowDimensions } from "react-native";
import { Controller, Control } from "react-hook-form";
import { InputField } from "./ui/InputField";
import { SectionLabel } from "./ui/SectionLabel";
import { ORDER_TYPES_T, ORDER_TYPE_VALUES } from "@/constants/translations";

interface StepOneProps {
  t: any;
  lang: any;
  control: Control<any>;
  getTypePhoto: (type: string) => any;
}

export const StepOne = ({ t, lang, control, getTypePhoto }: StepOneProps) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View>
      <Text className="text-3xl font-bold mb-1">{t.newOrder}</Text>
      <Text className="text-gray-400 mb-6">{t.step1title}</Text>

      <InputField
        control={control}
        name="orderName"
        placeholder={lang === "kaz" ? "Бұйымның аты (мыс: Ұлыма куртка)" : "Название заказа (напр: Куртка для сына)"}
        rules={{ required: lang === "kaz" ? "Бұйым атын енгізіңіз" : "Придумайте название для заказа" }}
      />
      <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: -8, marginBottom: 14, marginLeft: 4 }}>
        {lang === "kaz"
          ? "Бұл ат сіздің тапсырысыңызды ажырату үшін қолданылады"
          : "Это имя помогает отличить ваши заказы друг от друга"}
      </Text>

      <InputField
        control={control}
        name="clientName"
        placeholder={t.clientName}
        rules={{ required: t.errorRequired }}
      />
      <InputField
        control={control}
        name="phone"
        placeholder={t.phone}
        keyboardType="phone-pad"
        rules={{ required: t.errorRequired, minLength: { value: 10, message: t.errorPhone } }}
      />
      <InputField control={control} name="whatsApp" placeholder={t.whatsapp} keyboardType="phone-pad" />
      <InputField control={control} name="city" placeholder={t.city} rules={{ required: t.errorRequired }} />
      <InputField control={control} name="address" placeholder={t.address} />

      <SectionLabel>{t.orderType}</SectionLabel>

      <Controller
        control={control}
        name="orderType"
        render={({ field: { value, onChange } }) => (
          <View className="w-full px-2 md:px-6">
            <View className="flex-row justify-between w-full">
              <View className="w-[45%]">
                {ORDER_TYPES_T[lang].map((label, index) => {
                  const internalValue = ORDER_TYPE_VALUES[index];
                  const isActive = value === internalValue;

                  return (
                    <Pressable
                      key={internalValue}
                      onPress={() => onChange(internalValue)}
                      className={`mb-2 p-3.5 rounded-xl border ${
                        isActive ? "border-[#C5A059] bg-[#C5A059]/5" : "border-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-center ${
                          isActive ? "text-[#C5A059] font-semibold" : "text-gray-500"
                        }`}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View
                className={`w-[50%] overflow-hidden items-center justify-center ${
                  isTablet ? "bg-gray-100 rounded-3xl" : "rounded-3xl"
                }`}
                style={{ height: ORDER_TYPES_T[lang].length * (isTablet ? 70 : 60) }}
              >
                <Image
                  source={getTypePhoto(value)}
                  className="w-full h-full"
                  resizeMode={isTablet ? "contain" : "cover"}
                  style={{ borderRadius: 24 }}
                />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};
