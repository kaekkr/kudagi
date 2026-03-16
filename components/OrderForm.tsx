import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { ChevronRight, Ruler } from "lucide-react-native";
import { useOrderStore } from "../store/useOrderStore";
import { useRouter } from "expo-router";

const KU_GOLD = "#C5A059";

// Corrected relative paths to your JPG files
const TYPE_PHOTOS: Record<string, any> = {
  Стандартный: require("../assets/images/standard.jpg"),
  Парный: require("../assets/images/pair.jpg"),
  Семейный: require("../assets/images/family.jpg"),
  Срочный: require("../assets/images/urgent.jpg"),
  VIP: require("../assets/images/vip.jpg"),
};

const ChipSelector = ({ control, name, options }: any) => (
  <View className="flex-row flex-wrap">
    {options.map((opt: string) => (
      <Controller
        key={opt}
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity
            onPress={() => onChange(opt)}
            className={`mr-2 mb-2 px-6 py-3 rounded-full border ${
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
          </TouchableOpacity>
        )}
      />
    ))}
  </View>
);

export const OrderForm = () => {
  const [step, setStep] = useState(1);
  const addOrder = useOrderStore((state) => state.addOrder);
  const router = useRouter();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      orderType: "Стандартный",
      measurementMethod: "самостоятельно",
      totalPrice: "150000",
    },
  });

  const orderType = watch("orderType");
  const method = watch("measurementMethod");

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* ProgressBar - Match Screenshot 2 */}
      <View className="flex-row px-6 mt-4 justify-between">
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            className={`h-1.5 flex-1 mx-1 rounded-full ${s <= step ? `bg-[#C5A059]` : "bg-gray-100"}`}
          />
        ))}
      </View>

      <View className="px-6 pt-8">
        {step === 1 && (
          <View>
            <Text className="text-3xl font-bold mb-1">Оформление заказа</Text>
            <Text className="text-gray-400 mb-6">Шаг 1: Данные клиента</Text>

            <Text className="font-semibold text-gray-800 mb-3">
              Данные клиента
            </Text>
            <InputField
              control={control}
              name="clientName"
              placeholder="Имя и фамилия"
            />
            <InputField
              control={control}
              name="phone"
              placeholder="Телефон"
              keyboardType="phone-pad"
            />
            <InputField
              control={control}
              name="whatsApp"
              placeholder="WhatsApp"
            />
            <InputField control={control} name="city" placeholder="Город" />
            <InputField
              control={control}
              name="address"
              placeholder="Адрес доставки"
            />

            {/* Contact Person - Match Screenshot 1 */}
            <TouchableOpacity className="flex-row justify-between items-center bg-white border border-gray-200 p-4 rounded-xl mb-6">
              <Text className="text-gray-500">Контактное лицо</Text>
              <ChevronRight size={20} color="#D1D1D1" />
            </TouchableOpacity>

            <Text className="font-semibold text-gray-800 mb-3">Вид заказа</Text>
            <View className="flex-row items-start justify-between">
              <View className="w-[45%]">
                {["Стандартный", "Парный", "Семейный", "Срочный", "VIP"].map(
                  (type) => (
                    <Controller
                      key={type}
                      control={control}
                      name="orderType"
                      render={({ field: { onChange, value } }) => (
                        <TouchableOpacity
                          onPress={() => onChange(type)}
                          className={`mb-2 p-3.5 rounded-xl border ${value === type ? `border-[#C5A059]` : "border-gray-100"}`}
                        >
                          <Text
                            className={`text-center ${value === type ? `text-[#C5A059] font-bold` : "text-gray-400"}`}
                          >
                            {type}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  ),
                )}
              </View>
              {/* Model Photo Container - THE FIX IS HERE */}
              <View
                className="w-[50%] rounded-[30px] bg-gray-100 border border-gray-100"
                style={{
                  height: 260, // Fixed height to match the buttons
                  overflow: "hidden", // Mandatory to clip the image to rounded corners
                }}
              >
                <Image
                  source={TYPE_PHOTOS[orderType]}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="cover" // Forces image to fill while maintaining aspect ratio
                />
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text className="text-3xl font-bold mb-1">Детали заказа</Text>
            <Text className="text-gray-400 mb-6">Шаг 2: Параметры и мерки</Text>

            {/* 1. Цвет ткани: Just a checkbox as requested */}
            <View className="mb-6">
              <Text className="font-semibold mb-2">Цвет ткани</Text>
              <Checkbox
                control={control}
                name="colorConfirmed"
                text="Подтверждаю выбранный цвет ткани"
              />
            </View>

            {/* 2. Тип орнамента: A list of types to pick from */}
            <View className="mb-6">
              <Text className="font-semibold mb-2">Тип орнамента</Text>
              <ChipSelector
                control={control}
                name="ornamentType"
                options={["Тип 1", "Тип 2", "Тип 3", "Авторский"]}
              />
            </View>

            {/* 3. Цвет ниток вышивки: Text input for manual writing */}
            <View className="mb-6">
              <Text className="font-semibold mb-2">Цвет ниток вышивки</Text>
              <InputField
                control={control}
                name="embroideryColor"
                placeholder="Введите цвет (напр: Золотистый)"
              />
            </View>

            <View className="flex-row items-center mb-4 mt-8">
              <Ruler size={18} color={KU_GOLD} />
              <Text className="ml-2 font-semibold">Мерки клиента (см)</Text>
            </View>

            {/* Measurement Method Toggles - Match Screenshot 1 */}
            <View className="flex-row mb-6">
              <Controller
                control={control}
                name="measurementMethod"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TouchableOpacity
                      onPress={() => onChange("самостоятельно")}
                      className="flex-row items-center mr-8"
                    >
                      <View
                        className={`w-5 h-5 rounded border mr-2 items-center justify-center ${value === "самостоятельно" ? `bg-[#C5A059] border-[#C5A059]` : "border-gray-300"}`}
                      >
                        {value === "самостоятельно" && (
                          <Text className="text-white text-[10px]">✓</Text>
                        )}
                      </View>
                      <Text className="text-xs font-medium">
                        Самостоятельно
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onChange("мастер")}
                      className="flex-row items-center"
                    >
                      <View
                        className={`w-5 h-5 rounded border mr-2 items-center justify-center ${value === "мастер" ? `bg-[#C5A059] border-[#C5A059]` : "border-gray-300"}`}
                      >
                        {value === "мастер" && (
                          <Text className="text-white text-[10px]">✓</Text>
                        )}
                      </View>
                      <Text className="text-xs font-medium">Мастер KuDAGI</Text>
                    </TouchableOpacity>
                  </>
                )}
              />
            </View>

            {method === "самостоятельно" && (
              <View className="flex-row flex-wrap justify-between">
                {["Рост", "Обхват груди", "Талия", "Бёдра"].map((m) => (
                  <View key={m} className="w-[48%] mb-3">
                    <TextInput
                      className="bg-white border border-gray-100 p-4 rounded-2xl text-gray-800"
                      placeholder={m}
                      placeholderTextColor="#C1C1C1"
                      keyboardType="numeric"
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {step === 3 && (
          <View>
            <Text className="text-3xl font-bold mb-6">Оплата и условия</Text>
            <View className="bg-gray-50/50 border border-gray-100 p-5 rounded-3xl mb-6">
              <Text className="text-gray-400 text-xs mb-1">
                Общая стоимость
              </Text>
              <Text className="text-2xl font-bold mb-4">150 000 ₸</Text>
              <View className="h-[1px] bg-gray-100 mb-4" />
              <Text className={`text-[#C5A059] font-bold text-lg`}>
                Предоплата 50%: 75 000 ₸
              </Text>
            </View>

            <View className="bg-gray-50 p-5 rounded-2xl mb-8">
              <Text className="font-bold text-xs mb-3">
                Условия оформления заказа
              </Text>
              <Text className="text-[11px] text-gray-500 leading-5">
                • Требуется предоплата 50%{"\n"}• Изменения после начала кроя
                невозможны{"\n"}• Отклонение размеров до 1-2 см{"\n"}•
                Индивидуальные изделия возврату не подлежат
              </Text>
            </View>
            <Checkbox
              control={control}
              name="agreedToTerms"
              text="Согласен с условиями заказа"
            />
          </View>
        )}

        <TouchableOpacity
          onPress={() =>
            step < 3 ? setStep(step + 1) : handleSubmit(onFinalSubmit)()
          }
          className="bg-[#C5A059] p-5 rounded-2xl items-center shadow-sm mt-4"
        >
          <Text className="text-white font-bold text-lg uppercase">
            {step === 3 ? "Оформить заказ" : "Продолжить"}
          </Text>
        </TouchableOpacity>

        {step > 1 && (
          <TouchableOpacity
            onPress={() => setStep(step - 1)}
            className="mt-4 py-2 self-center"
          >
            <Text className="text-gray-400">Назад</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const InputField = ({ control, name, placeholder, ...props }: any) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <TextInput
        className="bg-white border border-gray-100 p-4 rounded-xl mb-3 text-gray-800"
        placeholder={placeholder}
        placeholderTextColor="#C1C1C1"
        value={value}
        onChangeText={onChange}
        {...props}
      />
    )}
  />
);

const Checkbox = ({ control, name, text }: any) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <TouchableOpacity
        onPress={() => onChange(!value)}
        className="flex-row items-center mb-4"
      >
        <View
          className={`w-5 h-5 rounded border mr-3 items-center justify-center ${value ? `bg-[#C5A059] border-[#C5A059]` : "border-gray-200"}`}
        >
          {value && <Text className="text-white text-[10px]">✓</Text>}
        </View>
        <Text className="text-sm text-gray-600">{text}</Text>
      </TouchableOpacity>
    )}
  />
);
