import { View, Text, Pressable, Image, useWindowDimensions } from "react-native";
import { Controller, Control } from "react-hook-form";
import { InputField } from "./ui/InputField";
import { SectionLabel } from "./ui/SectionLabel";
import { ORDER_TYPES_T } from "@/constants/translations";

interface StepOneProps {
  t: any;
  lang: any;
  control: Control<any>;
  getTypePhoto: (type: string) => any;
}

export const StepOne = ({ t, lang, control, getTypePhoto }: StepOneProps) => {
  const currentOrderTypes = lang === "kaz" ? ORDER_TYPES_T.kaz : ORDER_TYPES_T.rus;
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View>
      <Text className="text-3xl font-bold mb-1">{t.newOrder}</Text>
      <Text className="text-gray-400 mb-6">{t.step1title}</Text>

      {/* Order name — for uniqueness, client names it themselves */}
      <InputField
        control={control}
        name="orderName"
        placeholder={lang === "kaz" ? "Бұйымның аты (мыс: Ұлыма куртка)" : "Название заказа (напр: Куртка для сына)"}
        rules={{ required: lang === "kaz" ? "Бұйым атын енгізіңіз" : "Придумайте название для заказа" }}
      />

      {/* Hint text */}
      <Text
        style={{
          fontSize: 11,
          color: "#9CA3AF",
          marginTop: -8,
          marginBottom: 14,
          marginLeft: 4,
        }}
      >
        {lang === "kaz"
          ? "Бұл ат сіздің тапсырысыңызды ажырату үшін қолданылады"
          : "Это имя помогает отличить ваши заказы друг от друга"}
      </Text>

      {/* Client Information */}
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
        rules={{
          required: t.errorRequired,
          minLength: { value: 10, message: t.errorPhone }
        }}
      />
      <InputField
        control={control}
        name="whatsApp"
        placeholder={t.whatsapp}
        keyboardType="phone-pad"
      />
      <InputField
        control={control}
        name="city"
        placeholder={t.city}
        rules={{ required: t.errorRequired }}
      />
      <InputField
        control={control}
        name="address"
        placeholder={t.address}
      />

      {/* Order Type Selection */}
      <SectionLabel>{t.orderType}</SectionLabel>

      <View className="w-full px-2 md:px-6">
        <View className="flex-row justify-between w-full">

          {/* LEFT: Order Types */}
          <View className="w-[45%]">
            {currentOrderTypes.map((type, index) => (
              <Controller
                key={type}
                control={control}
                name="orderType"
                render={({ field: { onChange, value } }) => {
                  const russianValue = ORDER_TYPES_T.rus[index];
                  const isActive = value === russianValue;

                  return (
                    <Pressable
                      onPress={() => onChange(russianValue)}
                      className={`mb-2 p-3.5 rounded-xl border ${
                        isActive
                          ? "border-[#C5A059] bg-[#C5A059]/5"
                          : "border-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-center ${
                          isActive
                            ? "text-[#C5A059] font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {type}
                      </Text>
                    </Pressable>
                  );
                }}
              />
            ))}
          </View>

          {/* RIGHT: Image */}
          <Controller
            control={control}
            name="orderType"
            render={({ field: { value } }) => {
              const currentIndex = ORDER_TYPES_T.rus.indexOf(value);
              const techType =
                currentIndex !== -1
                  ? ORDER_TYPES_T.rus[currentIndex]
                  : "Стандартный";

              return (
                <View
                  className={`w-[50%] overflow-hidden items-center justify-center ${
                    isTablet ? "bg-gray-100 rounded-3xl" : "rounded-3xl"
                  }`}
                  style={{ height: currentOrderTypes.length * (isTablet ? 70 : 60) }}
                >
                  <Image
                    source={getTypePhoto(techType)}
                    className="w-full h-full"
                    resizeMode={isTablet ? "contain" : "cover"}
                    style={{ borderRadius: 24 }}
                  />
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};
