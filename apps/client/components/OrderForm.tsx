import React, { useState } from "react";
import {
  View, ScrollView, ActivityIndicator, Linking,
  Modal, Text, Pressable
} from "react-native";
import { useOrderStore } from "@kudagi/core";
import { useRemoteAssets } from "@/hooks/useRemoteAccess";
import { useOrderFormLogic } from "@/hooks/useOrderFormLogic";
import { mapFormToOrder } from "@/utils/orderMapper";
import { T, Lang } from "@/constants/translations";
import { KuDagiOrder } from "@kudagi/core";

// Sub-components
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { StepFour } from "./StepFour";
import { SuccessScreen } from "./SuccessScreen";
import { PaymentView } from "./PaymentView";
import { FormHeader } from "./ui/FormHeader";
import { NavigationFooter } from "./ui/NavigationFooter";

export default function OrderForm() {
  const [lang, setLang] = useState<Lang>("kaz");
  const t = T[lang];
  const [showPayment, setShowPayment] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [finalData, setFinalData] = useState<any>(null);

  // Duplicate order state
  const [duplicateOrder, setDuplicateOrder] = useState<KuDagiOrder | null>(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  const { ornamentList, getOrnamentImage, getTypePhoto, isLoading, uploadReferencePhoto } = useRemoteAssets();
  const addOrder = useOrderStore((state) => state.addOrder);
  const checkDuplicate = useOrderStore((state) => state.checkDuplicate);

  const {
    step, setStep, control, handleSubmit,
    handleNext, reset, pickPhoto,
    photoUploading, referencePhoto, setReferencePhoto,
    hydrated,
  } = useOrderFormLogic(uploadReferencePhoto);

  const onFinalSubmit = async (data: any) => {
    // Check for duplicate before proceeding to payment
    setCheckingDuplicate(true);
    try {
      const existing = await checkDuplicate(
        data.phone ?? "",
        data.garmentModel ?? "",
        data.desiredDate ?? ""
      );
      if (existing) {
        setDuplicateOrder(existing);
        setFinalData(data);
        return;
      }
    } finally {
      setCheckingDuplicate(false);
    }
    setFinalData(data);
    setShowPayment(true);
  };

  const handleCompletePayment = () => {
    if (!finalData) return;
    addOrder(mapFormToOrder(finalData, referencePhoto));
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

  if (isLoading || !hydrated) {
    return <View className="flex-1 justify-center"><ActivityIndicator color="#C5A059" /></View>;
  }

  if (isPaid) {
    return (
      <SuccessScreen
        onReset={() => { reset(); setStep(1); setIsPaid(false); setShowPayment(false); }}
      />
    );
  }

  if (showPayment && finalData) {
    return (
      <PaymentView
        data={finalData}
        onComplete={handleCompletePayment}
        onBack={() => setShowPayment(false)}
        onWhatsApp={handleWhatsAppConfirm}
      />
    );
  }

  return (
    <>
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 60 }}>
        <FormHeader step={step} lang={lang} setLang={setLang} />

        <View className="px-6 pt-8">
          {step === 1 && (
            <StepOne t={t} control={control} lang={lang} getTypePhoto={getTypePhoto} />
          )}
          {step === 2 && (
            <StepTwo
              t={t} control={control}
              lang={lang}
              ornamentList={ornamentList} getOrnamentImage={getOrnamentImage}
              photoUploading={photoUploading} referencePhoto={referencePhoto}
              pickPhoto={pickPhoto} setReferencePhoto={setReferencePhoto}
            />
          )}
          {step === 3 && (
            <StepThree t={t} control={control} lang={lang} />
          )}
          {step === 4 && (
            <StepFour t={t} control={control} />
          )}

          <NavigationFooter
            step={step}
            t={t}
            onNext={handleNext}
            onBack={() => setStep(step - 1)}
            onSubmit={handleSubmit(onFinalSubmit)}
            loading={checkingDuplicate}
          />
        </View>
      </ScrollView>

      {/* Duplicate Order Modal */}
      <Modal
        visible={!!duplicateOrder}
        transparent
        animationType="fade"
        onRequestClose={() => setDuplicateOrder(null)}
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-3xl p-6">
            {/* Icon */}
            <View className="w-14 h-14 bg-orange-100 rounded-full items-center justify-center self-center mb-4">
              <Text className="text-2xl">⚠️</Text>
            </View>

            <Text className="text-lg font-bold text-center text-gray-800 mb-2">
              Такой заказ уже существует
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-5">
              Заказ с таким номером телефона, моделью и датой уже был оформлен ранее.
            </Text>

            {/* Existing order summary (read-only) */}
            {duplicateOrder && (
              <View className="bg-gray-50 rounded-2xl p-4 mb-5">
                <Text className="text-xs text-gray-400 mb-1">Существующий заказ</Text>
                <Text className="font-semibold text-gray-800">{duplicateOrder.clientName}</Text>
                <Text className="text-sm text-gray-500">{duplicateOrder.phone}</Text>
                <Text className="text-sm text-gray-500">
                  {duplicateOrder.garmentModel} · {duplicateOrder.quantity} шт.
                </Text>
                <Text className="text-sm text-gray-500">
                  К дате: {duplicateOrder.desiredDate || "—"}
                </Text>
                <View className="mt-2 self-start bg-[#C5A059]/10 px-3 py-1 rounded-full">
                  <Text className="text-xs text-[#C5A059] font-semibold">
                    {duplicateOrder.status}
                  </Text>
                </View>
              </View>
            )}

            {/* Actions */}
            <Pressable
              onPress={() => {
                // Dismiss and go back to edit — don't submit
                setDuplicateOrder(null);
              }}
              className="bg-[#C5A059] py-4 rounded-2xl mb-3"
            >
              <Text className="text-white font-bold text-center">Изменить заказ</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                // Force submit anyway (user confirmed it's intentional)
                setDuplicateOrder(null);
                if (finalData) setShowPayment(true);
              }}
              className="border border-gray-200 py-4 rounded-2xl"
            >
              <Text className="text-gray-500 text-center">Всё равно отправить</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
