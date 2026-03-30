import React from "react";
import { View, Text } from "react-native";
import { Control } from "react-hook-form";

// UI Components
import { SectionLabel } from "./ui/SectionLabel";
import { ChipSelector } from "./ui/ChipSelector";
import { Checkbox } from "./ui/Checkbox";

interface StepFourProps {
  t: any;
  control: Control<any>;
}

const PAYMENT_OPTIONS = [
  "Kaspi Перевод",
  "Kaspi QR",
  "Kaspi Red",
  "Банковский перевод",
  "Наличные"
];

export const StepFour = ({ t, control }: StepFourProps) => {
  return (
    <View>
      <Text className="text-3xl font-bold mb-6">{t.step4title}</Text>

      {/* Pricing Information Card */}
      <View className="bg-gray-50 p-5 rounded-3xl mb-5">
        <Text className="text-gray-400 text-xs mb-1">{t.priceTitle}</Text>
        <Text className="text-2xl font-bold text-gray-800">{t.priceSubtitle}</Text>
        <Text className="text-gray-400 text-xs mt-2">
          {t.priceNote}
        </Text>
      </View>

      {/* Payment Method Selection */}
      <SectionLabel>{t.paymentMethod}</SectionLabel>
      <ChipSelector
        control={control}
        name="paymentMethod"
        options={PAYMENT_OPTIONS}
      />

      {/* Terms & Conditions Block */}
      <View className="bg-orange-50 p-4 rounded-2xl mt-2 mb-5">
        <Text className="text-[11px] text-orange-800 leading-5">
          {t.terms}
        </Text>
      </View>

      <Checkbox
        control={control}
        name="agreedToTerms"
        text={t.agreeTerms}
        rules={{ required: t.errorTerms }}
      />

      {/* Data Consent Block */}
      <View className="bg-gray-50 p-4 rounded-2xl mt-4 mb-4">
        <Text className="text-[11px] text-gray-500 leading-5">
          {t.consentText}
        </Text>
      </View>

      <Checkbox
        control={control}
        name="consentedToData"
        text={t.consentCheck}
        rules={{ required: t.errorConsent }}
      />
    </View>
  );
};
