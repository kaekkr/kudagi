import { View, Text, Pressable, Image } from "react-native";
import { Controller, Control } from "react-hook-form";
import { InputField } from "./ui/InputField";
import { SectionLabel } from "./ui/SectionLabel";

interface StepOneProps {
  t: any;
  control: Control<any>;
  orderType: string;
  getTypePhoto: (type: string) => any;
}

const ORDER_TYPES = ["Стандартный", "Парный", "Семейный", "Срочный", "VIP"];

export const StepOne = ({ t, control, orderType, getTypePhoto }: StepOneProps) => {
  const isFamilyOrder = orderType === "Семейный";

  return (
    <View>
      <Text className="text-3xl font-bold mb-1">{t.newOrder}</Text>
      <Text className="text-gray-400 mb-6">{t.step1title}</Text>

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
      <View className="flex-row justify-between">
        <View className="w-[45%]">
          {ORDER_TYPES.map((type) => (
            <Controller
              key={type}
              control={control}
              name="orderType"
              render={({ field: { onChange, value } }) => (
                <Pressable
                  onPress={() => onChange(type)}
                  className={`mb-2 p-3.5 rounded-xl border ${
                    value === type ? "border-[#C5A059] bg-[#C5A059]/5" : "border-gray-100"
                  }`}
                >
                  <Text className={`text-center ${value === type ? "text-[#C5A059] font-bold" : "text-gray-400"}`}>
                    {type}
                  </Text>
                </Pressable>
              )}
            />
          ))}
        </View>

        {/* Dynamic Image Preview */}
        <View className="w-[50%] rounded-3xl bg-gray-100 overflow-hidden" style={{ height: 240 }}>
          <Image
            source={getTypePhoto(orderType)}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Conditional Field */}
      {isFamilyOrder && (
        <View className="mt-4">
          <SectionLabel>{t.contactPerson}</SectionLabel>
          <InputField control={control} name="contactPerson" placeholder={t.contactPerson} />
        </View>
      )}
    </View>
  );
};
