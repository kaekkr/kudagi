import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Ruler } from "lucide-react-native";
import { useOrderStore } from "@kudagi/core";

const KU_GOLD = "#C5A059";

const TYPE_PHOTOS: Record<string, any> = {
  Стандартный: require("../assets/images/standard.jpg"),
  Парный: require("../assets/images/pair.jpg"),
  Семейный: require("../assets/images/family.jpg"),
  Срочный: require("../assets/images/urgent.jpg"),
  VIP: require("../assets/images/vip.jpg"),
};

const ORNAMENT_TYPES = [
  "Тип 1","Тип 2","Тип 3","Тип 4","Тип 5",
  "Тип 6","Тип 7","Тип 8","Тип 9","Тип 10",
];

const ORNAMENT_PHOTOS: Record<string, any> = {
  "Тип 1": require("../assets/images/ornament1.png"),
  "Тип 2": require("../assets/images/ornament2.png"),
  "Тип 3": require("../assets/images/ornament3.png"),
  "Тип 4": require("../assets/images/ornament4.png"),
  "Тип 5": require("../assets/images/ornament5.png"),
  "Тип 6": require("../assets/images/ornament6.png"),
  "Тип 7": require("../assets/images/ornament7.png"),
  "Тип 8": require("../assets/images/ornament8.png"),
  "Тип 9": require("../assets/images/ornament9.png"),
  "Тип 10": require("../assets/images/ornament10.png"),
};

const GARMENT_MODELS = ["Платье", "Жилет", "Чапан", "Пальто", "Другое"];
const ORNAMENT_POSITIONS = ["Ворот", "Рукав", "Карман", "Подол", "Другое"];

// --- Helpers ---

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

const ChipSelector = ({ control, name, options }: any) => (
  <View className="flex-row flex-wrap mb-3">
    {options.map((opt: string) => (
      <Controller
        key={opt}
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Pressable
            onPress={() => onChange(opt)}
            className={`mr-2 mb-2 px-4 py-2.5 rounded-xl border ${
              value === opt
                ? "border-[#C5A059] bg-[#C5A059]/10"
                : "border-gray-100 bg-white"
            }`}
          >
            <Text className={value === opt ? "text-[#C5A059] font-bold" : "text-gray-400"}>
              {opt}
            </Text>
          </Pressable>
        )}
      />
    ))}
  </View>
);

const Checkbox = ({ control, name, text }: any) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <Pressable
        onPress={() => onChange(!value)}
        className="flex-row items-center mb-4"
      >
        <View
          className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
            value ? "bg-[#C5A059] border-[#C5A059]" : "border-gray-200"
          }`}
        >
          {value && <Text className="text-white text-[10px]">✓</Text>}
        </View>
        <Text className="text-sm text-gray-600 flex-1">{text}</Text>
      </Pressable>
    )}
  />
);

const OrnamentCarousel = ({ control, name }: any) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row py-2"
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {ORNAMENT_TYPES.map((type) => {
          const isSelected = value === type;
          return (
            <Pressable
              key={type}
              onPress={() => onChange(type)}
              activeOpacity={0.8}
              className="mr-4 items-center w-24"
            >
              <View
                className={`w-24 h-24 rounded-3xl overflow-hidden border-2 mb-2 justify-center items-center ${
                  isSelected
                    ? "border-[#C5A059] bg-[#C5A059]/5"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <Image
                  source={ORNAMENT_PHOTOS[type]}
                  style={{ width: "80%", height: "80%" }}
                  resizeMode="contain"
                />
                {isSelected && (
                  <View className="absolute top-2 right-2 bg-[#C5A059] rounded-full w-5 h-5 items-center justify-center">
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

// --- Main Component ---

export default function OrderForm() {
  const [step, setStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [finalData, setFinalData] = useState<any>(null);

  const addOrder = useOrderStore((state) => state.addOrder);

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      clientName: "",
      phone: "",
      whatsApp: "",
      city: "",
      address: "",
      orderType: "Стандартный",
      garmentModel: "Платье",
      ornamentType: "Тип 1",
      ornamentPosition: "Ворот",
      embroideryColor: "",
      colorConfirmed: false,
      measurementMethod: "самостоятельно",
      height: "",
      chest: "",
      waist: "",
      hips: "",
      paymentMethod: "Kaspi Перевод",
      agreedToTerms: false,
    },
  });

  const orderType = watch("orderType");
  const method = watch("measurementMethod");

  const resetAll = () => {
    reset();
    setFinalData(null);
    setStep(1);
    setIsPaid(false);
    setShowPayment(false);
  };

  const onFinalSubmit = (data: any) => {
    setFinalData(data);
    setShowPayment(true);
  };

  const handleCompletePayment = () => {
    if (!finalData) return;

    const newOrder = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
      clientName: finalData.clientName?.trim() || "Клиент",
      phone: finalData.phone?.trim() || "-",
      whatsApp: finalData.whatsApp?.trim() || "",
      city: finalData.city?.trim() || "",
      address: finalData.address?.trim() || "",
      orderType: finalData.orderType,
      garmentModel: finalData.garmentModel,
      ornamentType: finalData.ornamentType,
      ornamentPosition: finalData.ornamentPosition,
      embroideryColor: finalData.embroideryColor?.trim() || "",
      measurements: {
        height: parseFloat(finalData.height) || 0,
        chest: parseFloat(finalData.chest) || 0,
        waist: parseFloat(finalData.waist) || 0,
        hips: parseFloat(finalData.hips) || 0,
      },
      totalPrice: 150000,
      depositPaid: true,
      paymentMethod: finalData.paymentMethod,
      status: "Принято" as const,
      createdAt: new Date().toISOString(),
      statusUpdatedAt: new Date().toISOString(),
    };

    addOrder(newOrder);
    setIsPaid(true);
  };

  const handleWhatsAppConfirm = () => {
    if (!finalData) return;
    const name = finalData.clientName?.trim() || "Клиент";
    const phone = finalData.phone?.trim() || "";
    const msg = encodeURIComponent(
      `Пожалуйста внимательно проверьте параметры вашего заказа.\n\n` +
      `Клиент: ${name}\n` +
      `Телефон: ${phone}\n` +
      `Модель: ${finalData.garmentModel}\n` +
      `Вид заказа: ${finalData.orderType}\n` +
      `Орнамент: ${finalData.ornamentType}, расположение: ${finalData.ornamentPosition}\n` +
      `Цвет ниток: ${finalData.embroideryColor || "—"}\n\n` +
      `Если всё указано верно, напишите:\n` +
      `Подтверждаю заказ. Все параметры указаны верно. С условиями ознакомлен(а) и согласен(на).`
    );
    // Opens WhatsApp with pre-filled message to KuDAGI manager number
    Linking.openURL(`https://wa.me/77072847407?text=${msg}`);
  };

  if (isPaid) {
    return <SuccessScreen onReset={resetAll} />;
  }

  if (showPayment && finalData) {
    return (
      <ScrollView className="flex-1 bg-gray-100" contentContainerStyle={{ padding: 24 }}>
        <PaymentView
          data={finalData}
          onComplete={handleCompletePayment}
          onWhatsApp={handleWhatsAppConfirm}
        />
        <Pressable onPress={() => setShowPayment(false)} className="mt-6 self-center">
          <Text className="text-gray-400">Изменить детали заказа</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Progress bar */}
      <View className="flex-row px-6 mt-6 justify-between">
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            className={`h-1.5 flex-1 mx-1 rounded-full ${s <= step ? "bg-[#C5A059]" : "bg-gray-100"}`}
          />
        ))}
      </View>

      <View className="px-6 pt-8">

        {/* STEP 1: Client info + order type + garment model */}
        {step === 1 && (
          <View>
            <Text className="text-3xl font-bold mb-1">Новый заказ</Text>
            <Text className="text-gray-400 mb-6">Шаг 1: Клиент и модель</Text>

            <InputField control={control} name="clientName" placeholder="Имя и фамилия" />
            <InputField control={control} name="phone" placeholder="Телефон" keyboardType="phone-pad" />
            <InputField control={control} name="whatsApp" placeholder="WhatsApp" keyboardType="phone-pad" />
            <InputField control={control} name="city" placeholder="Город" />
            <InputField control={control} name="address" placeholder="Адрес доставки" />

            <Text className="font-semibold text-gray-800 mb-3 mt-4">Модель изделия</Text>
            <ChipSelector control={control} name="garmentModel" options={GARMENT_MODELS} />

            <Text className="font-semibold text-gray-800 mb-3 mt-2">Вид заказа</Text>
            <View className="flex-row justify-between">
              <View className="w-[45%]">
                {["Стандартный", "Парный", "Семейный", "Срочный", "VIP"].map((type) => (
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
              <View className="w-[50%] rounded-3xl bg-gray-100 overflow-hidden" style={{ height: 240 }}>
                <Image
                  source={TYPE_PHOTOS[orderType]}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        )}

        {/* STEP 2: Ornament + measurements */}
        {step === 2 && (
          <View>
            <Text className="text-3xl font-bold mb-1">Детали заказа</Text>
            <Text className="text-gray-400 mb-6">Шаг 2: Орнамент и мерки</Text>

            <Checkbox control={control} name="colorConfirmed" text="Подтверждаю выбранный цвет ткани" />

            <Text className="font-semibold mb-3 mt-2">Тип орнамента</Text>
            <View className="mb-4">
              <OrnamentCarousel control={control} name="ornamentType" />
            </View>

            <Text className="font-semibold mb-3">Расположение орнамента</Text>
            <ChipSelector control={control} name="ornamentPosition" options={ORNAMENT_POSITIONS} />

            <InputField
              control={control}
              name="embroideryColor"
              placeholder="Цвет ниток вышивки (напр: Золото)"
            />

            <View className="flex-row items-center mb-4 mt-4">
              <Ruler size={18} color={KU_GOLD} />
              <Text className="ml-2 font-semibold">Мерки клиента (см)</Text>
            </View>

            <View className="flex-row mb-4">
              {[
                { value: "самостоятельно", label: "Ввожу сам(а)" },
                { value: "мастер", label: "Снимет мастер" },
              ].map((m) => (
                <Controller
                  key={m.value}
                  control={control}
                  name="measurementMethod"
                  render={({ field: { onChange, value } }) => (
                    <Pressable
                      onPress={() => onChange(m.value)}
                      className="flex-row items-center mr-6"
                    >
                      <View
                        className={`w-4 h-4 rounded-full border mr-2 ${
                          value === m.value ? "bg-[#C5A059] border-[#C5A059]" : "border-gray-300"
                        }`}
                      />
                      <Text className="text-xs">{m.label}</Text>
                    </Pressable>
                  )}
                />
              ))}
            </View>

            {method === "самостоятельно" && (
              <View className="flex-row flex-wrap justify-between">
                {[
                  { name: "height", label: "Рост" },
                  { name: "chest", label: "Грудь" },
                  { name: "waist", label: "Талия" },
                  { name: "hips", label: "Бёдра" },
                ].map((f) => (
                  <View key={f.name} className="w-[48%]">
                    <InputField
                      control={control}
                      name={f.name}
                      placeholder={f.label}
                      keyboardType="numeric"
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* STEP 3: Payment + terms */}
        {step === 3 && (
          <View>
            <Text className="text-3xl font-bold mb-6">Оплата</Text>

            <View className="bg-gray-50 p-6 rounded-3xl mb-6">
              <Text className="text-gray-400 text-xs mb-1">К оплате (предоплата 50%)</Text>
              <Text className="text-3xl font-bold text-[#C5A059]">75 000 ₸</Text>
              <Text className="text-gray-400 text-xs mt-2">Полная стоимость: 150 000 ₸</Text>
            </View>

            <Text className="font-semibold mb-3">Способ оплаты</Text>
            <ChipSelector
              control={control}
              name="paymentMethod"
              options={["Kaspi Перевод", "Kaspi QR", "Банковский перевод", "Наличные"]}
            />

            <View className="bg-orange-50 p-4 rounded-2xl mt-2 mb-6">
              <Text className="text-[11px] text-orange-800 leading-5">
                • Для запуска заказа требуется предоплата 50%{"\n"}
                • До начала кроя можно вносить изменения{"\n"}
                • После начала кроя изменения оплачиваются дополнительно{"\n"}
                • Индивидуальные изделия возврату не подлежат{"\n"}
                • Допустимое отклонение при пошиве 1–2 см
              </Text>
            </View>

            <Checkbox control={control} name="agreedToTerms" text="Согласен(на) с условиями KuDAGI" />
          </View>
        )}

        {/* Navigation buttons */}
        <Pressable
          onPress={step < 3 ? () => setStep(step + 1) : handleSubmit(onFinalSubmit)}
          className="bg-[#C5A059] p-5 rounded-2xl items-center shadow-lg mt-4"
        >
          <Text className="text-white font-bold text-lg uppercase">
            {step === 3 ? "Оформить заказ" : "Продолжить"}
          </Text>
        </Pressable>

        {step > 1 && (
          <Pressable onPress={() => setStep(step - 1)} className="mt-4 py-2 self-center">
            <Text className="text-gray-400 font-medium">Вернуться назад</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

// --- Payment View ---

const PaymentView = ({ data, onComplete, onWhatsApp }: any) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFakePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 2000);
  };

  return (
    <View className="p-6 bg-white rounded-3xl shadow-xl">
      <Text className="text-xl font-bold mb-1 text-center">Подтверждение заказа</Text>
      <Text className="text-gray-400 text-xs text-center mb-5">
        {data.clientName} · {data.garmentModel} · {data.orderType}
      </Text>

      {data.paymentMethod === "Kaspi Перевод" && (
        <View className="items-center">
          <Text className="text-gray-600 text-center mb-4">
            Переведите <Text className="font-bold">75 000 ₸</Text> на Kaspi:
          </Text>
          <View className="bg-gray-100 p-4 rounded-2xl mb-4 w-full">
            <Text className="text-lg font-bold text-center">+7 (707) 284-74-07</Text>
            <Text className="text-xs text-gray-400 text-center">Получатель: Мадина К.</Text>
          </View>
          <Text className="text-sm text-orange-600 text-center mb-4">
            ⚠️ Скиньте чек в WhatsApp после перевода
          </Text>
          <Pressable onPress={onWhatsApp} className="bg-[#25D366] w-full p-4 rounded-xl items-center mb-3">
            <Text className="text-white font-bold">Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={onComplete} className="bg-[#C5A059] w-full p-4 rounded-xl items-center">
            <Text className="text-white font-bold">Я перевел(а) · Завершить</Text>
          </Pressable>
        </View>
      )}

      {data.paymentMethod === "Kaspi QR" && (
        <View className="items-center">
          <View className="w-48 h-48 bg-gray-50 border-2 border-[#E11D48] rounded-3xl items-center justify-center mb-4">
            <Text className="text-[#E11D48] font-bold">KASPI QR</Text>
          </View>
          <Text className="text-gray-500 text-xs mb-4 text-center">
            Откройте Kaspi.kz и отсканируйте код
          </Text>
          <Pressable onPress={onWhatsApp} className="bg-[#25D366] w-full p-4 rounded-xl items-center mb-3">
            <Text className="text-white font-bold">Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable
            onPress={handleFakePay}
            className="bg-[#E11D48] w-full p-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">
              {isProcessing ? "Проверка оплаты..." : "Подтвердить оплату"}
            </Text>
          </Pressable>
        </View>
      )}

      {data.paymentMethod === "Банковский перевод" && (
        <View>
          <View className="bg-gray-50 p-4 rounded-2xl mb-4">
            <Text className="text-[10px] text-gray-400 mb-1 uppercase">Номер карты</Text>
            <TextInput
              className="text-lg border-b border-gray-100 pb-2 mb-4"
              placeholder="0000 0000 0000 0000"
              keyboardType="numeric"
              maxLength={19}
            />
            <View className="flex-row justify-between">
              <TextInput className="w-[45%] border-b border-gray-100 pb-2" placeholder="ММ/ГГ" keyboardType="numeric" />
              <TextInput className="w-[45%] border-b border-gray-100 pb-2" placeholder="CVV" keyboardType="numeric" secureTextEntry />
            </View>
          </View>
          <Pressable
            onPress={handleFakePay}
            disabled={isProcessing}
            className={`w-full p-4 rounded-xl items-center ${isProcessing ? "bg-gray-400" : "bg-black"}`}
          >
            <Text className="text-white font-bold">
              {isProcessing ? "Обработка..." : "Оплатить 75 000 ₸"}
            </Text>
          </Pressable>
        </View>
      )}

      {data.paymentMethod === "Наличные" && (
        <View className="items-center py-4">
          <Text className="text-gray-600 text-center mb-4">
            Оплата наличными при получении или в ателье.
          </Text>
          <Pressable onPress={onWhatsApp} className="bg-[#25D366] w-full p-4 rounded-xl items-center mb-3">
            <Text className="text-white font-bold">Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={onComplete} className="bg-[#C5A059] w-full p-4 rounded-xl items-center">
            <Text className="text-white font-bold">Подтвердить заказ</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

// --- Success Screen ---

const SuccessScreen = ({ onReset }: { onReset: () => void }) => (
  <View className="flex-1 items-center justify-center p-6">
    <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
      <Text className="text-green-600 text-3xl">✓</Text>
    </View>
    <Text className="text-2xl font-bold text-center mb-2">Заказ принят!</Text>
    <Text className="text-gray-500 text-center mb-8">
      Мадина свяжется с вами в ближайшее время для подтверждения деталей.
    </Text>
    <Pressable onPress={onReset} className="bg-[#C5A059] px-10 py-4 rounded-2xl">
      <Text className="text-white font-bold">Создать новый заказ</Text>
    </Pressable>
  </View>
);
