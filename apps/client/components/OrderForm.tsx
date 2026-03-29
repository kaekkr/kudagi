import React, { useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useOrderStore } from "@kudagi/core";
import { useRemoteAssets } from "@/hooks/useRemoteAccess";
import { useOrderFormLogic } from "@/hooks/useOrderFormLogic";
import { mapFormToOrder } from "@/utils/orderMapper";
import { T, Lang } from "@/constants/translations";

// Sub-components
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { StepFour } from "./StepFour";
import { SuccessScreen } from "./SuccessScreen";
import { PaymentView } from "./PaymentView";
import { FormHeader } from "./ui/FormHeader"; // Moved progress bar here
import { NavigationFooter } from "./ui/NavigationFooter"; // Moved buttons here

export default function OrderForm() {
  const [lang, setLang] = useState<Lang>("kaz");
  const t = T[lang];
  const [showPayment, setShowPayment] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [finalData, setFinalData] = useState<any>(null);

  const { ornamentList, getOrnamentImage, getTypePhoto, isLoading, uploadReferencePhoto } = useRemoteAssets();
  const addOrder = useOrderStore((state) => state.addOrder);

  const {
    step, setStep, control, handleSubmit, watch,
    handleNext, reset, pickPhoto,
    photoUploading, referencePhoto, setReferencePhoto
  } = useOrderFormLogic(uploadReferencePhoto);

  // Form State Watchers
  const orderType = watch("orderType");
  const method = watch("measurementMethod");

  const onFinalSubmit = (data: any) => {
    setFinalData(data);
    setShowPayment(true);
  };

  const handleCompletePayment = () => {
    if (!finalData) return;
    addOrder(mapFormToOrder(finalData, referencePhoto));
    setIsPaid(true);
  };

  if (isLoading) return <View className="flex-1 justify-center"><ActivityIndicator color="#C5A059" /></View>;
  if (isPaid) return <SuccessScreen onReset={() => { reset(); setStep(1); setIsPaid(false); setShowPayment(false); }} />;

  if (showPayment && finalData) {
    return (
      <PaymentView
        data={finalData}
        onComplete={handleCompletePayment}
        onBack={() => setShowPayment(false)}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 60 }}>
      <FormHeader step={step} lang={lang} setLang={setLang} />

      <View className="px-6 pt-8">
        {step === 1 && (
          <StepOne t={t} control={control} orderType={orderType} getTypePhoto={getTypePhoto} />
        )}
        {step === 2 && (
          <StepTwo
            t={t} control={control}
            ornamentList={ornamentList} getOrnamentImage={getOrnamentImage}
            photoUploading={photoUploading} referencePhoto={referencePhoto}
            pickPhoto={pickPhoto} setReferencePhoto={setReferencePhoto}
          />
        )}
        {step === 3 && (
          <StepThree t={t} control={control} lang={lang} method={method} />
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
        />
      </View>
    </ScrollView>
  );
}
