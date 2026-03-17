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
import { Ruler } from "lucide-react-native";
import { useOrderStore } from "../store/useOrderStore";
import { useRouter } from "expo-router";

const KU_GOLD = "#C5A059";

// Фото видов заказа (Экран 1)
const TYPE_PHOTOS: Record<string, any> = {
  Стандартный: require("../assets/images/standard.jpg"),
  Парный: require("../assets/images/pair.jpg"),
  Семейный: require("../assets/images/family.jpg"),
  Срочный: require("../assets/images/urgent.jpg"),
  VIP: require("../assets/images/vip.jpg"),
};

// Фото типов орнамента (Экран 2)
const ORNAMENT_PHOTOS: Record<string, any> = {
  "Тип 1": require("../assets/images/ornament1.jpg"),
  "Тип 2": require("../assets/images/ornament2.jpg"),
  "Тип 3": require("../assets/images/ornament3.jpg"),
  Авторский: require("../assets/images/custom.jpg"),
};

// --- Вспомогательные компоненты ---

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
  <View className="flex-row flex-wrap">
    {options.map((opt: string) => (
      <Controller
        key={opt}
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity
            onPress={() => onChange(opt)}
            className={`mr-2 mb-2 px-4 py-2.5 rounded-xl border ${
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
          className={`w-5 h-5 rounded border mr-3 items-center justify-center ${value ? "bg-[#C5A059] border-[#C5A059]" : "border-gray-200"}`}
        >
          {value && <Text className="text-white text-[10px]">✓</Text>}
        </View>
        <Text className="text-sm text-gray-600">{text}</Text>
      </TouchableOpacity>
    )}
  />
);

export default function OrderForm() {
  const [step, setStep] = useState(1);
  const [isPaid, setIsPaid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [finalData, setFinalData] = useState(null);

  const addOrder = useOrderStore((state) => state.addOrder);

  // 1. Оставляем только ОДИН вызов useForm
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      clientName: "",
      phone: "",
      whatsApp: "",
      city: "",
      address: "",
      orderType: "Стандартный",
      ornamentType: "Тип 1",
      ornamentPosition: "Грудь",
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
  const ornamentType = watch("ornamentType");
  const method = watch("measurementMethod");

  // 2. Исправленная функция сброса
  const resetAll = () => {
    reset(); // Очищает поля формы
    setFinalData(null); // Удаляет сохраненные данные заказа
    setStep(1); // Возвращает на первый экран
    setIsPaid(false); // Убирает экран успеха
    setShowPayment(false); // Убирает экран оплаты
  };

  const onFinalSubmit = (data: any) => {
    setFinalData(data);
    setShowPayment(true); // Показываем экран оплаты вместо формы
  };

  const handleCompletePayment = () => {
    // Сохраняем заказ в стор
    addOrder({
      ...finalData,
      status: "Принято",
      date: new Date().toLocaleDateString(),
    });
    setIsPaid(true); // Показываем экран успеха
  };

  if (isPaid) {
    return <SuccessScreen onReset={resetAll} />;
  }

  // 2. Если нажали "Оформить" — показываем имитацию оплаты
  if (showPayment && finalData) {
    return (
      <View className="flex-1 bg-gray-100 justify-center p-6">
        <PaymentView data={finalData} onComplete={handleCompletePayment} />
        <TouchableOpacity
          onPress={() => setShowPayment(false)}
          className="mt-6 self-center"
        >
          <Text className="text-gray-400">Изменить детали заказа</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Прогресс-бар */}
      <View className="flex-row px-6 mt-6 justify-between">
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            className={`h-1.5 flex-1 mx-1 rounded-full ${s <= step ? "bg-[#C5A059]" : "bg-gray-100"}`}
          />
        ))}
      </View>

      <View className="px-6 pt-8">
        {/* ЭКРАН 1: ДАННЫЕ И ВИД ЗАКАЗА */}
        {step === 1 && (
          <View>
            <Text className="text-3xl font-bold mb-1">Новый заказ</Text>
            <Text className="text-gray-400 mb-6">Шаг 1: Клиент и модель</Text>

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

            <Text className="font-semibold text-gray-800 mb-3 mt-4">
              Вид заказа
            </Text>
            <View className="flex-row justify-between">
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
                          className={`mb-2 p-3.5 rounded-xl border ${value === type ? "border-[#C5A059] bg-[#C5A059]/5" : "border-gray-100"}`}
                        >
                          <Text
                            className={`text-center ${value === type ? "text-[#C5A059] font-bold" : "text-gray-400"}`}
                          >
                            {type}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  ),
                )}
              </View>
              <View
                className="w-[50%] rounded-3xl bg-gray-100 overflow-hidden"
                style={{ height: 240 }}
              >
                <Image
                  source={TYPE_PHOTOS[orderType]}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        )}

        {/* ЭКРАН 2: ДЕТАЛИ ИЗДЕЛИЯ */}
        {step === 2 && (
          <View>
            <Text className="text-3xl font-bold mb-1">Детали заказа</Text>
            <Text className="text-gray-400 mb-6">Шаг 2: Орнамент и мерки</Text>

            <Checkbox
              control={control}
              name="colorConfirmed"
              text="Подтверждаю выбранный цвет ткани"
            />

            <Text className="font-semibold mb-3 mt-2">Тип орнамента</Text>

            {/* Фиксируем высоту и выравнивание, чтобы кнопки не дергались */}
            <View
              className="flex-row justify-between items-start mb-6"
              style={{ minHeight: 160 }}
            >
              {/* Левая часть: Кнопки (строго 48%) */}
              <View className="w-[48%]">
                <ChipSelector
                  control={control}
                  name="ornamentType"
                  options={["Тип 1", "Тип 2", "Тип 3", "Авторский"]}
                />
              </View>

              {/* Правая часть: Картинка (строго 48% и фиксированная высота) */}
              <View
                className="w-[48%] rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden"
                style={{ height: 160 }}
              >
                <Image
                  key={ornamentType} // key заставит Image корректно обновиться при смене типа
                  source={ORNAMENT_PHOTOS[ornamentType]}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text className="font-semibold mb-3">Расположение вышивки</Text>
            <ChipSelector
              control={control}
              name="ornamentPosition"
              options={["Грудь", "Спина", "Рукава", "Подол"]}
            />

            <InputField
              control={control}
              name="embroideryColor"
              placeholder="Цвет ниток (напр: Золото)"
            />

            {/* Остальной код (мерки) остается без изменений */}
            <View className="flex-row items-center mb-4 mt-6">
              <Ruler size={18} color={KU_GOLD} />
              <Text className="ml-2 font-semibold">Мерки клиента (см)</Text>
            </View>

            <View className="flex-row mb-4">
              {["самостоятельно", "мастер"].map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() =>
                    control._reset({
                      ...control._formValues,
                      measurementMethod: m,
                    })
                  }
                  className="flex-row items-center mr-6"
                >
                  <Controller
                    control={control}
                    name="measurementMethod"
                    render={({ field: { value } }) => (
                      <View
                        className={`w-4 h-4 rounded-full border mr-2 ${value === m ? "bg-[#C5A059] border-[#C5A059]" : "border-gray-300"}`}
                      />
                    )}
                  />
                  <Text className="text-xs capitalize">{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {method === "самостоятельно" && (
              <View className="flex-row flex-wrap justify-between">
                {["height", "chest", "waist", "hips"].map((field) => (
                  <View key={field} className="w-[48%]">
                    <InputField
                      control={control}
                      name={field}
                      placeholder={
                        field === "height"
                          ? "Рост"
                          : field === "chest"
                            ? "Грудь"
                            : field === "waist"
                              ? "Талия"
                              : "Бёдра"
                      }
                      keyboardType="numeric"
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ЭКРАН 3: ОПЛАТА И УСЛОВИЯ */}
        {step === 3 && (
          <View>
            <Text className="text-3xl font-bold mb-6">Оплата</Text>

            <View className="bg-gray-50 p-6 rounded-3xl mb-6">
              <Text className="text-gray-400 text-xs mb-1">
                К оплате (предоплата 50%)
              </Text>
              <Text className="text-3xl font-bold text-[#C5A059]">
                75 000 ₸
              </Text>
              <Text className="text-gray-400 text-xs mt-2">
                Полная стоимость: 150 000 ₸
              </Text>
            </View>

            <Text className="font-semibold mb-3">Способ оплаты</Text>
            <ChipSelector
              control={control}
              name="paymentMethod"
              options={[
                "Kaspi Перевод",
                "Kaspi QR",
                "Банковский перевод",
                "Наличные",
              ]}
            />

            <View className="bg-orange-50 p-4 rounded-2xl mt-4 mb-6">
              <Text className="text-[11px] text-orange-800 leading-5">
                • Индивидуальный пошив возврату не подлежит{"\n"}• Изменения
                после начала кроя не принимаются
              </Text>
            </View>

            <Checkbox
              control={control}
              name="agreedToTerms"
              text="Согласен с условиями KuDAGI"
            />
          </View>
        )}

        {/* КНОПКИ НАВИГАЦИИ */}
        <TouchableOpacity
          onPress={
            step < 3 ? () => setStep(step + 1) : handleSubmit(onFinalSubmit)
          }
          className="bg-[#C5A059] p-5 rounded-2xl items-center shadow-lg mt-4"
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
            <Text className="text-gray-400 font-medium">Вернуться назад</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const PaymentView = ({ data, onComplete }: any) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFakePay = () => {
    setIsProcessing(true);
    // Имитация задержки банка
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 2000);
  };

  return (
    <View className="p-6 bg-white rounded-3xl shadow-xl">
      <Text className="text-xl font-bold mb-4 text-center">Оплата заказа</Text>

      {/* КАСПИ ПЕРЕВОД */}
      {data.paymentMethod === "Kaspi Перевод" && (
        <View className="items-center">
          <Text className="text-gray-600 text-center mb-4">
            Переведите <Text className="font-bold">75 000 ₸</Text> на Kaspi:
          </Text>
          <View className="bg-gray-100 p-4 rounded-2xl mb-4 w-full">
            <Text className="text-lg font-bold text-center">
              +7 (707) 123-45-67
            </Text>
            <Text className="text-xs text-gray-400 text-center">
              Получатель: Мадина К.
            </Text>
          </View>
          <Text className="text-sm text-orange-600 text-center mb-6">
            ⚠️ Обязательно скиньте чек в WhatsApp после перевода
          </Text>
          <TouchableOpacity
            onPress={onComplete}
            className="bg-[#C5A059] w-full p-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">
              Я перевел(а), отправить чек
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* КАСПИ QR (Имитация) */}
      {data.paymentMethod === "Kaspi QR" && (
        <View className="items-center">
          <View className="w-48 h-48 bg-gray-50 border-2 border-[#E11D48] rounded-3xl items-center justify-center mb-4">
            {/* Здесь можно вставить реальную иконку QR */}
            <Text className="text-[#E11D48] font-bold">KASPI QR</Text>
          </View>
          <Text className="text-gray-500 text-xs mb-6 text-center">
            Откройте Kaspi.kz и отсканируйте код
          </Text>
          <TouchableOpacity
            onPress={handleFakePay}
            className="bg-[#E11D48] w-full p-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">
              {isProcessing ? "Проверка оплаты..." : "Подтвердить оплату"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* БАНКОВСКИЙ ПЕРЕВОД / КАРТА */}
      {data.paymentMethod === "Банковский перевод" && (
        <View>
          <View className="bg-gray-50 p-4 rounded-2xl mb-4">
            <Text className="text-[10px] text-gray-400 mb-1 uppercase">
              Номер карты
            </Text>
            <TextInput
              className="text-lg border-b border-gray-100 pb-2 mb-4"
              placeholder="0000 0000 0000 0000"
              keyboardType="numeric"
              maxLength={16}
            />
            <View className="flex-row justify-between">
              <TextInput
                className="w-[45%] border-b border-gray-100 pb-2"
                placeholder="ММ/ГГ"
                keyboardType="numeric"
              />
              <TextInput
                className="w-[45%] border-b border-gray-100 pb-2"
                placeholder="CVV"
                keyboardType="numeric"
                secureTextEntry
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={handleFakePay}
            disabled={isProcessing}
            className={`w-full p-4 rounded-xl items-center ${isProcessing ? "bg-gray-400" : "bg-black"}`}
          >
            <Text className="text-white font-bold">
              {isProcessing ? "Обработка..." : "Оплатить 75 000 ₸"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* НАЛИЧНЫЕ */}
      {data.paymentMethod === "Наличные" && (
        <View className="items-center py-4">
          <Text className="text-gray-600 text-center mb-6">
            Вы выбрали оплату наличными при получении или в ателье.
          </Text>
          <TouchableOpacity
            onPress={onComplete}
            className="bg-[#C5A059] w-full p-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Подтвердить заказ</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const SuccessScreen = ({ onReset }: { onReset: () => void }) => {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
        <Text className="text-green-600 text-3xl">✓</Text>
      </View>
      <Text className="text-2xl font-bold text-center mb-2">Заказ принят!</Text>
      <Text className="text-gray-500 text-center mb-8">
        Отлично, заказ взят в обработку. Мадина свяжется с вами в ближайшее
        время для уточнения деталей.
      </Text>

      <TouchableOpacity
        onPress={onReset} // <--- Calls the reset logic
        className="bg-[#C5A059] px-10 py-4 rounded-2xl"
      >
        <Text className="text-white font-bold">Создать новый заказ</Text>
      </TouchableOpacity>
    </View>
  );
};
