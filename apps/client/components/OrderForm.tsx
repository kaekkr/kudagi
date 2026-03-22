import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  Linking,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Ruler, Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useOrderStore } from "@kudagi/core";

const SUPABASE_URL = "https://klvotqhinoapghxinrmy.supabase.co";
const SUPABASE_KEY = "sb_publishable_OJn9yxGI168WN4T5jb7nSQ_G-GhJHFD";
const BASE_HEADERS = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

async function fetchRemoteOrnaments(): Promise<{ name: string; imageUrl: string }[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/ornaments?order=created_at.asc&select=name,image_url`,
      { headers: { ...BASE_HEADERS, "Content-Type": "application/json" } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((r: any) => ({ name: r.name, imageUrl: r.image_url ?? "" }));
  } catch { return []; }
}

async function fetchRemoteOrderTypePhotos(): Promise<Record<string, string>> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/order_type_photos?select=order_type,image_url`,
      { headers: { ...BASE_HEADERS, "Content-Type": "application/json" } }
    );
    if (!res.ok) return {};
    const data = await res.json();
    const map: Record<string, string> = {};
    data.forEach((r: any) => { if (r.image_url) map[r.order_type] = r.image_url; });
    return map;
  } catch { return {}; }
}

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
const OCCASIONS = ["Свадьба", "Праздник", "Юбилей", "Другое"];
const DELIVERY_METHODS = ["Самовывоз", "Курьер", "Почта / межгород"];

// ── Helpers ──────────────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: string }) => (
  <Text className="font-semibold text-gray-800 mb-3 mt-4">{children}</Text>
);

const InputField = ({ control, name, placeholder, rules, ...props }: any) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <View className="mb-3">
        <TextInput
          className={`bg-white border p-4 rounded-xl text-gray-800 ${error ? "border-red-300" : "border-gray-100"}`}
          placeholder={placeholder}
          placeholderTextColor="#C1C1C1"
          value={value}
          onChangeText={onChange}
          {...props}
        />
        {error && <Text className="text-red-400 text-xs mt-1 ml-1">{error.message}</Text>}
      </View>
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
              value === opt ? "border-[#C5A059] bg-[#C5A059]/10" : "border-gray-100 bg-white"
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

const Checkbox = ({ control, name, text, rules }: any) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <View className="mb-4">
        <Pressable onPress={() => onChange(!value)} className="flex-row items-start">
          <View
            className={`w-5 h-5 rounded border mr-3 mt-0.5 items-center justify-center flex-shrink-0 ${
              error ? "border-red-400" : value ? "bg-[#C5A059] border-[#C5A059]" : "border-gray-200"
            }`}
          >
            {value && <Text className="text-white text-[10px]">✓</Text>}
          </View>
          <Text className="text-sm text-gray-600 flex-1">{text}</Text>
        </Pressable>
        {error && <Text className="text-red-400 text-xs mt-1 ml-8">{error.message}</Text>}
      </View>
    )}
  />
);

const OrnamentCarousel = ({ control, name, ornamentList, getOrnamentImage }: any) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        className="py-2"
      >
        {ornamentList.map((type) => {
          const isSelected = value === type;
          return (
            <Pressable
              key={type}
              onPress={() => onChange(type)}
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

// ── Main Component ────────────────────────────────────────────────────────────

export default function OrderForm() {
  const [step, setStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [finalData, setFinalData] = useState<any>(null);
  const [referencePhoto, setReferencePhoto] = useState<string | null>(null);
  const [remoteOrnaments, setRemoteOrnaments] = useState<{ name: string; imageUrl: string }[]>([]);
  const [remoteTypePhotos, setRemoteTypePhotos] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRemoteOrnaments().then(setRemoteOrnaments);
    fetchRemoteOrderTypePhotos().then(setRemoteTypePhotos);
  }, []);

  // Use remote ornaments if loaded, otherwise fall back to local
  const ornamentList = remoteOrnaments.length > 0
    ? remoteOrnaments.map((o) => o.name)
    : ORNAMENT_TYPES;

  const getOrnamentImage = (name: string) => {
    const remote = remoteOrnaments.find((o) => o.name === name);
    if (remote?.imageUrl) return { uri: remote.imageUrl };
    return ORNAMENT_PHOTOS[name] ?? ORNAMENT_PHOTOS["Тип 1"];
  };

  const getTypePhoto = (type: string) => {
    if (remoteTypePhotos[type]) return { uri: remoteTypePhotos[type] };
    return TYPE_PHOTOS[type] ?? TYPE_PHOTOS["Стандартный"];
  };

  const addOrder = useOrderStore((state) => state.addOrder);

  const { control, handleSubmit, watch, reset, trigger } = useForm({
    defaultValues: {
      clientName: "",
      phone: "",
      whatsApp: "",
      city: "",
      address: "",
      contactPerson: "",
      orderType: "Стандартный",
      garmentModel: "Платье",
      quantity: "1",
      fabricColor: "",
      fabricType: "",
      ornamentType: "Тип 1",
      ornamentPosition: "Ворот",
      embroideryColor: "",
      colorConfirmed: false,
      occasion: "Праздник",
      desiredDate: "",
      deadlineConfirmed: false,
      deliveryMethod: "Самовывоз",
      measurementMethod: "самостоятельно",
      height: "",
      chest: "",
      waist: "",
      hips: "",
      comment: "",
      paymentMethod: "Kaspi Перевод",
      agreedToTerms: false,
      consentedToData: false,
    },
  });

  const orderType = watch("orderType");

  const STEP_FIELDS: Record<number, string[]> = {
    1: ["clientName", "phone", "city"],
    2: ["quantity", "fabricColor", "embroideryColor", "colorConfirmed"],
    3: ["desiredDate", "deadlineConfirmed"],
    4: ["agreedToTerms", "consentedToData"],
  };

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step] as any);
    if (valid) setStep(step + 1);
  };
  const method = watch("measurementMethod");
  const isFamilyOrder = orderType === "Семейный";

  const resetAll = () => {
    reset();
    setFinalData(null);
    setReferencePhoto(null);
    setStep(1);
    setIsPaid(false);
    setShowPayment(false);
  };

  const pickPhoto = async () => {
    if (Platform.OS === "web") {
      // Web: use input file picker
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const url = URL.createObjectURL(file);
          setReferencePhoto(url);
        }
      };
      input.click();
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setReferencePhoto(result.assets[0].uri);
    }
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
      contactPerson: finalData.contactPerson?.trim() || "",
      orderType: finalData.orderType,
      garmentModel: finalData.garmentModel,
      quantity: parseInt(finalData.quantity) || 1,
      fabricColor: finalData.fabricColor?.trim() || "",
      fabricType: finalData.fabricType?.trim() || "",
      ornamentType: finalData.ornamentType,
      ornamentPosition: finalData.ornamentPosition,
      embroideryColor: finalData.embroideryColor?.trim() || "",
      occasion: finalData.occasion,
      desiredDate: finalData.desiredDate?.trim() || "",
      deliveryMethod: finalData.deliveryMethod,
      comment: finalData.comment?.trim() || "",
      referencePhotoUrl: referencePhoto ?? "",
      consentedToData: finalData.consentedToData,
      measurements: {
        height: parseFloat(finalData.height) || 0,
        chest: parseFloat(finalData.chest) || 0,
        waist: parseFloat(finalData.waist) || 0,
        hips: parseFloat(finalData.hips) || 0,
      },
      totalPrice: 0, // Set by admin
      depositPaid: false,
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
    const msg = encodeURIComponent(
      `Пожалуйста внимательно проверьте параметры вашего заказа.\n\n` +
      `Клиент: ${finalData.clientName}\n` +
      `Телефон: ${finalData.phone}\n` +
      `Модель: ${finalData.garmentModel} (${finalData.quantity} шт.)\n` +
      `Вид заказа: ${finalData.orderType}\n` +
      `Цвет ткани: ${finalData.fabricColor || "—"}\n` +
      `Тип ткани: ${finalData.fabricType || "—"}\n` +
      `Орнамент: ${finalData.ornamentType}, расположение: ${finalData.ornamentPosition}\n` +
      `Цвет ниток: ${finalData.embroideryColor || "—"}\n` +
      `Повод: ${finalData.occasion}\n` +
      `Нужен к: ${finalData.desiredDate || "—"}\n` +
      `Доставка: ${finalData.deliveryMethod}\n` +
      `Оплата: ${finalData.paymentMethod}\n` +
      (finalData.comment ? `Комментарий: ${finalData.comment}\n` : "") +
      `\nЕсли всё указано верно, напишите:\n` +
      `Подтверждаю заказ. Все параметры указаны верно. С условиями ознакомлен(а) и согласен(на).`
    );
    Linking.openURL(`https://wa.me/77072847407?text=${msg}`);
  };

  if (isPaid) return <SuccessScreen onReset={resetAll} />;

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
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Progress bar — 4 steps now */}
      <View className="flex-row px-6 mt-6">
        {[1, 2, 3, 4].map((s) => (
          <View
            key={s}
            className={`h-1.5 flex-1 mx-1 rounded-full ${s <= step ? "bg-[#C5A059]" : "bg-gray-100"}`}
          />
        ))}
      </View>

      <View className="px-6 pt-8">

        {/* ── STEP 1: Client info ── */}
        {step === 1 && (
          <View>
            <Text className="text-3xl font-bold mb-1">Новый заказ</Text>
            <Text className="text-gray-400 mb-6">Шаг 1: Данные клиента</Text>

            <InputField control={control} name="clientName" placeholder="Имя и фамилия" rules={{ required: "Укажите имя и фамилию" }} />
            <InputField control={control} name="phone" placeholder="Телефон" keyboardType="phone-pad" rules={{ required: "Укажите номер телефона", minLength: { value: 10, message: "Введите корректный номер" } }} />
            <InputField control={control} name="whatsApp" placeholder="WhatsApp" keyboardType="phone-pad" />
            <InputField control={control} name="city" placeholder="Город" rules={{ required: "Укажите город" }} />
            <InputField control={control} name="address" placeholder="Адрес доставки" />

            <SectionLabel>Вид заказа</SectionLabel>
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
                <Image source={getTypePhoto(orderType)} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              </View>
            </View>

            {isFamilyOrder && (
              <>
                <SectionLabel>Контактное лицо (семейный заказ)</SectionLabel>
                <InputField control={control} name="contactPerson" placeholder="Ответственный клиент" />
              </>
            )}
          </View>
        )}

        {/* ── STEP 2: Garment details ── */}
        {step === 2 && (
          <View>
            <Text className="text-3xl font-bold mb-1">Изделие</Text>
            <Text className="text-gray-400 mb-6">Шаг 2: Модель и орнамент</Text>

            <SectionLabel>Модель изделия</SectionLabel>
            <ChipSelector control={control} name="garmentModel" options={GARMENT_MODELS} />

            <SectionLabel>Количество изделий</SectionLabel>
            <InputField control={control} name="quantity" placeholder="1" keyboardType="numeric" rules={{ required: "Укажите количество", min: { value: 1, message: "Минимум 1 изделие" } }} />

            <SectionLabel>Цвет ткани</SectionLabel>
            <InputField control={control} name="fabricColor" placeholder="Напр: Тёмно-синий" rules={{ required: "Укажите цвет ткани" }} />

            <SectionLabel>Тип ткани (если известно)</SectionLabel>
            <InputField control={control} name="fabricType" placeholder="Напр: Бархат, атлас..." />

            <SectionLabel>Тип орнамента</SectionLabel>
            <OrnamentCarousel control={control} name="ornamentType" ornamentList={ornamentList} getOrnamentImage={getOrnamentImage} />

            <SectionLabel>Расположение орнамента</SectionLabel>
            <ChipSelector control={control} name="ornamentPosition" options={ORNAMENT_POSITIONS} />

            <SectionLabel>Цвет ниток вышивки</SectionLabel>
            <InputField control={control} name="embroideryColor" placeholder="Напр: Золото" rules={{ required: "Укажите цвет ниток" }} />

            <Checkbox control={control} name="colorConfirmed" text="Цвет изделия подтверждаю" rules={{ required: "Подтвердите цвет изделия" }} />

            {/* Reference photo */}
            <SectionLabel>Фото модели изделия (образец)</SectionLabel>
            <Pressable
              onPress={pickPhoto}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-5 items-center mb-4"
            >
              {referencePhoto ? (
                <Image
                  source={{ uri: referencePhoto }}
                  style={{ width: "100%", height: 180, borderRadius: 12 }}
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <Camera size={32} color="#C1C1C1" />
                  <Text className="text-gray-400 text-sm mt-2">Нажмите, чтобы прикрепить фото</Text>
                  <Text className="text-gray-300 text-xs mt-1">Необязательно</Text>
                </View>
              )}
            </Pressable>
            {referencePhoto && (
              <Pressable onPress={() => setReferencePhoto(null)} className="self-center mb-4">
                <Text className="text-red-400 text-sm">Удалить фото</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* ── STEP 3: Measurements + occasion + delivery ── */}
        {step === 3 && (
          <View>
            <Text className="text-3xl font-bold mb-1">Мерки и сроки</Text>
            <Text className="text-gray-400 mb-6">Шаг 3: Размеры, повод, доставка</Text>

            <View className="flex-row items-center mb-3">
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
                    <Pressable onPress={() => onChange(m.value)} className="flex-row items-center mr-6">
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
              <View className="flex-row flex-wrap justify-between mb-2">
                {[
                  { name: "height", label: "Рост" },
                  { name: "chest", label: "Обхват груди" },
                  { name: "waist", label: "Талия" },
                  { name: "hips", label: "Бёдра" },
                ].map((f) => (
                  <View key={f.name} className="w-[48%]">
                    <InputField control={control} name={f.name} placeholder={f.label} keyboardType="numeric" />
                  </View>
                ))}
              </View>
            )}

            <SectionLabel>Повод</SectionLabel>
            <ChipSelector control={control} name="occasion" options={OCCASIONS} />

            <SectionLabel>Дата, когда нужен заказ</SectionLabel>
            <InputField control={control} name="desiredDate" placeholder="Напр: 15.08.2025" rules={{ required: "Укажите желаемую дату" }} />

            <Checkbox
              control={control}
              name="deadlineConfirmed"
              text="Я понимаю сроки изготовления заказа"
              rules={{ required: "Подтвердите понимание сроков" }}
            />

            <SectionLabel>Способ доставки</SectionLabel>
            <ChipSelector control={control} name="deliveryMethod" options={DELIVERY_METHODS} />

            <SectionLabel>Комментарий</SectionLabel>
            <InputField
              control={control}
              name="comment"
              placeholder="Дополнительные пожелания..."
              multiline
              numberOfLines={3}
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />
          </View>
        )}

        {/* ── STEP 4: Payment + consent ── */}
        {step === 4 && (
          <View>
            <Text className="text-3xl font-bold mb-6">Оплата</Text>

            <View className="bg-gray-50 p-5 rounded-3xl mb-5">
              <Text className="text-gray-400 text-xs mb-1">Стоимость заказа</Text>
              <Text className="text-2xl font-bold text-gray-800">Уточняется менеджером</Text>
              <Text className="text-gray-400 text-xs mt-2">Предоплата 50% для запуска производства</Text>
            </View>

            <SectionLabel>Способ оплаты</SectionLabel>
            <ChipSelector
              control={control}
              name="paymentMethod"
              options={["Kaspi Перевод", "Kaspi QR", "Kaspi Red", "Банковский перевод", "Наличные"]}
            />

            <View className="bg-orange-50 p-4 rounded-2xl mt-2 mb-5">
              <Text className="text-[11px] text-orange-800 leading-5">
                • Для запуска заказа требуется предоплата 50%{"\n"}
                • До начала кроя можно вносить изменения{"\n"}
                • После начала кроя изменения оплачиваются дополнительно{"\n"}
                • При отказе удерживается стоимость выполненных работ{"\n"}
                • Индивидуальные изделия возврату не подлежат{"\n"}
                • Допустимое отклонение при пошиве 1–2 см
              </Text>
            </View>

            <Checkbox control={control} name="agreedToTerms" text="Согласен(на) с условиями KuDAGI" rules={{ required: "Необходимо принять условия" }} />

            <View className="bg-gray-50 p-4 rounded-2xl mb-4">
              <Text className="text-[11px] text-gray-500 leading-5">
                Заполняя данную форму, я даю согласие Дому Моды KuDAGI на сбор, обработку и хранение моих персональных данных (имя, номер телефона, город, адрес доставки, мерки и другие данные), указанных в форме, исключительно для оформления и выполнения моего заказа.
              </Text>
            </View>

            <Checkbox
              control={control}
              name="consentedToData"
              text="Даю согласие на обработку персональных данных"
              rules={{ required: "Необходимо дать согласие" }}
            />
          </View>
        )}

        {/* Navigation */}
        <Pressable
          onPress={step < 4 ? handleNext : handleSubmit(onFinalSubmit)}
          className="bg-[#C5A059] p-5 rounded-2xl items-center mt-4"
        >
          <Text className="text-white font-bold text-lg uppercase">
            {step === 4 ? "Оформить заказ" : "Продолжить"}
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

// ── Payment View ──────────────────────────────────────────────────────────────

const PaymentView = ({ data, onComplete, onWhatsApp }: any) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFakePay = () => {
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); onComplete(); }, 2000);
  };

  return (
    <View className="p-6 bg-white rounded-3xl shadow-xl">
      <Text className="text-xl font-bold mb-1 text-center">Подтверждение заказа</Text>
      <Text className="text-gray-400 text-xs text-center mb-5">
        {data.clientName} · {data.garmentModel} · {data.quantity} шт. · {data.orderType}
      </Text>

      {data.paymentMethod === "Kaspi Перевод" && (
        <View className="items-center">
          <Text className="text-gray-600 text-center mb-3">
            Менеджер свяжется с вами и сообщит точную стоимость.{"\n"}После чего переведите предоплату 50%:
          </Text>
          <View className="bg-gray-100 p-4 rounded-2xl mb-4 w-full">
            <Text className="text-lg font-bold text-center">+7 (707) 284-74-07</Text>
            <Text className="text-xs text-gray-400 text-center">Получатель: Мадина К.</Text>
          </View>
          <Pressable onPress={onWhatsApp} className="bg-[#25D366] w-full p-4 rounded-xl items-center mb-3">
            <Text className="text-white font-bold">Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={onComplete} className="bg-[#C5A059] w-full p-4 rounded-xl items-center">
            <Text className="text-white font-bold">Завершить оформление</Text>
          </Pressable>
        </View>
      )}

      {(data.paymentMethod === "Kaspi QR" || data.paymentMethod === "Kaspi Red") && (
        <View className="items-center">
          <View className="w-48 h-48 bg-gray-50 border-2 border-[#E11D48] rounded-3xl items-center justify-center mb-4">
            <Text className="text-[#E11D48] font-bold">KASPI</Text>
          </View>
          <Pressable onPress={onWhatsApp} className="bg-[#25D366] w-full p-4 rounded-xl items-center mb-3">
            <Text className="text-white font-bold">Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={handleFakePay} className="bg-[#E11D48] w-full p-4 rounded-xl items-center">
            <Text className="text-white font-bold">
              {isProcessing ? "Проверка..." : "Подтвердить"}
            </Text>
          </Pressable>
        </View>
      )}

      {data.paymentMethod === "Банковский перевод" && (
        <View className="items-center">
          <Text className="text-gray-600 text-center mb-4">
            Менеджер пришлёт реквизиты для перевода после подтверждения заказа.
          </Text>
          <Pressable onPress={onWhatsApp} className="bg-[#25D366] w-full p-4 rounded-xl items-center mb-3">
            <Text className="text-white font-bold">Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={onComplete} className="bg-[#C5A059] w-full p-4 rounded-xl items-center">
            <Text className="text-white font-bold">Завершить оформление</Text>
          </Pressable>
        </View>
      )}

      {data.paymentMethod === "Наличные" && (
        <View className="items-center py-2">
          <Text className="text-gray-600 text-center mb-4">
            Оплата наличными при получении или в ателье.
          </Text>
          <Pressable onPress={onWhatsApp} className="bg-[#25D366] w-full p-4 rounded-xl items-center mb-3">
            <Text className="text-white font-bold">Отправить детали в WhatsApp</Text>
          </Pressable>
          <Pressable onPress={onComplete} className="bg-[#C5A059] w-full p-4 rounded-xl items-center">
            <Text className="text-white font-bold">Завершить оформление</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

// ── Success Screen ────────────────────────────────────────────────────────────

const SuccessScreen = ({ onReset }: { onReset: () => void }) => (
  <View className="flex-1 items-center justify-center p-6">
    <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
      <Text className="text-green-600 text-3xl">✓</Text>
    </View>
    <Text className="text-2xl font-bold text-center mb-2">Заказ принят!</Text>
    <Text className="text-gray-500 text-center mb-8">
      Мадина свяжется с вами в ближайшее время для подтверждения деталей и стоимости.
    </Text>
    <Pressable onPress={onReset} className="bg-[#C5A059] px-10 py-4 rounded-2xl">
      <Text className="text-white font-bold">Создать новый заказ</Text>
    </Pressable>
  </View>
);
