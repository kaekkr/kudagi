import { useRef, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useOrderStore, KuDagiOrder, usePriceStore } from "@kudagi/core";
import { useRemoteAssets } from "@/hooks/useRemoteAccess";
import { useOrderFormLogic } from "@/hooks/useOrderFormLogic";
import { useAutoUpdate } from "@/hooks/useAutoUpdate";
import { mapFormToOrder } from "@/utils/orderMapper";
import { sendOrderToWhatsApp } from "@/utils/whatsapp";
import { T, Lang } from "@/constants/translations";

import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { StepFour } from "./StepFour";
import { SuccessScreen } from "./SuccessScreen";
import { PaymentView } from "./PaymentView";
import { FormHeader } from "./ui/FormHeader";
import { NavigationFooter } from "./ui/NavigationFooter";
import { DuplicateOrderModal } from "./DuplicateOrderModal";

export default function OrderForm() {
  useAutoUpdate();

  const scrollRef = useRef<ScrollView>(null);

  const [lang, setLang] = useState<Lang>("rus");
  const t = T[lang];

  const [showPayment,        setShowPayment]        = useState(false);
  const [isPaid,             setIsPaid]             = useState(false);
  const [finalData,          setFinalData]          = useState<any>(null);
  const [duplicateOrder,     setDuplicateOrder]     = useState<KuDagiOrder | null>(null);
  const [checkingDuplicate,  setCheckingDuplicate]  = useState(false);

  const { ornamentList, getOrnamentImage, getTypePhoto, isLoading, uploadReferencePhoto } =
    useRemoteAssets();

  const addOrder       = useOrderStore((s) => s.addOrder);
  const checkDuplicate = useOrderStore((s) => s.checkDuplicate);

  const {
    step, setStep, control, handleSubmit,
    handleNext, reset, pickPhoto,
    photoUploading, referencePhoto, setReferencePhoto,
    hydrated, setValue
  } = useOrderFormLogic(uploadReferencePhoto);

  const handleNextWithScroll = async () => {
    await handleNext();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const onFinalSubmit = async (data: any) => {
    setCheckingDuplicate(true);
    try {
      const existing = await checkDuplicate(data.phone ?? "", data.orderName ?? "");
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

  const { prices, ornamentPrices } = usePriceStore();

  const handleCompletePayment = () => {
    if (!finalData) return;

    // Рассчитываем стоимость динамически прямо перед отправкой:
    let calculatedTotal = 0;

    if (finalData.orderType === "Парный") {
      // Логика для парного заказа (Первый человек)
      const p1ModelPrice = prices.find(p => p.productModel === finalData.p1GarmentModel)?.price_from || 0;
      let p1OrnamentsPrice = 0;
      (finalData.p1Ornaments || []).forEach((orn: any) => {
        const found = ornamentPrices.find(o => o.name === orn.type);
        p1OrnamentsPrice += (found?.price_from || 0);
      });

      // (Второй человек)
      const p2ModelPrice = prices.find(p => p.productModel === finalData.p2GarmentModel)?.price_from || 0;
      let p2OrnamentsPrice = 0;
      (finalData.p2Ornaments || []).forEach((orn: any) => {
        const found = ornamentPrices.find(o => o.name === orn.type);
        p2OrnamentsPrice += (found?.price_from || 0);
      });

      calculatedTotal = p1ModelPrice + p1OrnamentsPrice + p2ModelPrice + p2OrnamentsPrice;
    } else {
      // Логика для стандартного одиночного заказа
      const modelPrice = prices.find(p => p.productModel === finalData.garmentModel)?.price_from || 0;
      
      let ornamentsPrice = 0;
      // Если у вас массив строк орнаментов:
      if (Array.isArray(finalData.ornamentType)) {
        finalData.ornamentType.forEach((typeStr: string) => {
          const found = ornamentPrices.find(o => o.name === typeStr);
          ornamentsPrice += (found?.price_from || 0);
        });
      }

      calculatedTotal = modelPrice + ornamentsPrice;
    }

    // Если в форме всё-таки была какая-то своя цена — берём её, иначе — наш точный расчёт
    const finalPrice = finalData.totalPrice || calculatedTotal;

    // Передаем итоговую цену третьим аргументом в маппер
    addOrder(mapFormToOrder(finalData, referencePhoto, finalPrice));
    setIsPaid(true);
  };

  if (isLoading || !hydrated) {
    return <View className="flex-1 justify-center"><ActivityIndicator color="#C5A059" /></View>;
  }

  if (isPaid) {
    return (
      <SuccessScreen
        onReset={() => {
          reset();
          setStep(1);
          setIsPaid(false);
          setShowPayment(false);
        }}
      />
    );
  }

  if (showPayment && finalData) {
    return (
      <PaymentView
        data={finalData}
        onComplete={handleCompletePayment}
        onBack={() => setShowPayment(false)}
        onWhatsApp={() => sendOrderToWhatsApp(finalData)}
      />
    );
  }

  return (
    <>
      <ScrollView
        ref={scrollRef}
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <FormHeader step={step} lang={lang} setLang={setLang} />

        <View className="px-6 pt-8">
          {step === 1 && (
            <StepOne t={t} control={control} lang={lang} getTypePhoto={getTypePhoto} />
          )}
          {step === 2 && (
            <StepTwo
              t={t} control={control} lang={lang}
              ornamentList={ornamentList} getOrnamentImage={getOrnamentImage}
              photoUploading={photoUploading} referencePhoto={referencePhoto}
              pickPhoto={pickPhoto} setReferencePhoto={setReferencePhoto} 
              setValue={setValue}
            />
          )}
          {step === 3 && <StepThree t={t} control={control} lang={lang} />}
          {step === 4 && <StepFour t={t} control={control} />}

          <NavigationFooter
            step={step}
            t={t}
            onNext={handleNextWithScroll}
            onBack={() => {
              setStep(step - 1);
              scrollRef.current?.scrollTo({ y: 0, animated: true });
            }}
            onSubmit={handleSubmit(onFinalSubmit)}
            loading={checkingDuplicate}
          />
        </View>
      </ScrollView>

      <DuplicateOrderModal
        duplicateOrder={duplicateOrder}
        onClose={() => setDuplicateOrder(null)}
        onProceed={() => {
          setDuplicateOrder(null);
          if (finalData) setShowPayment(true);
        }}
      />
    </>
  );
}
