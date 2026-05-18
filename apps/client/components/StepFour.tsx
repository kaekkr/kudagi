import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Control, useWatch } from "react-hook-form";
import { SectionLabel } from "./ui/SectionLabel";
import { ChipSelector } from "./ui/ChipSelector";
import { Checkbox } from "./ui/Checkbox";
import { PAYMENT_METHOD_VALUES } from "@/constants/translations";
import { usePriceStore } from "@kudagi/core";
import { calculatePrice } from "@/utils/priceCalculator";

interface StepFourProps {
  t: any;
  control: Control<any>;
}

const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₸";

export const StepFour = ({ t, control }: StepFourProps) => {
  const { prices, ornamentPrices, fetchPrices, fetchOrnamentPrices } = usePriceStore();

  useEffect(() => {
    if (prices.length === 0)         fetchPrices();
    if (ornamentPrices.length === 0) fetchOrnamentPrices();
  }, []);

  // Watch fields that affect price
  const formData = useWatch({ control });
  const breakdown = calculatePrice(formData, prices, ornamentPrices);
  const hasPrice = breakdown.total > 0;

  return (
    <View>
      <Text className="text-3xl font-bold mb-6">{t.step4title}</Text>

      {/* Price breakdown card */}
      <View style={{ backgroundColor: "#F9FAFB", borderRadius: 20, padding: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {t.priceTitle}
        </Text>

        {hasPrice ? (
          <>
            {/* Line items */}
            {breakdown.lines.map((line, i) => (
              <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <Text style={{ fontSize: 13, color: "#6B7280", flex: 1, marginRight: 8 }}>{line.label}</Text>
                <Text style={{ fontSize: 13, color: "#374151", fontWeight: "600" }}>{fmt(line.amount)}</Text>
              </View>
            ))}

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: "#E5E7EB", marginVertical: 10 }} />

            {/* Total */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827" }}>Итого</Text>
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827" }}>{fmt(breakdown.total)}</Text>
            </View>

            {/* Deposit */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Предоплата 50%</Text>
              <Text style={{ fontSize: 12, color: "#C5A059", fontWeight: "600" }}>{fmt(breakdown.deposit)}</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 4 }}>
              {t.priceSubtitle}
            </Text>
            <Text style={{ fontSize: 11, color: "#9CA3AF" }}>{t.priceNote}</Text>
          </>
        )}
      </View>

      {/* Payment method */}
      <SectionLabel>{t.paymentMethod}</SectionLabel>
      <ChipSelector
        control={control}
        name="paymentMethod"
        options={PAYMENT_METHOD_VALUES}
      />

      {/* Terms */}
      <View className="bg-orange-50 p-4 rounded-2xl mt-2 mb-5">
        <Text className="text-[11px] text-orange-800 leading-5">{t.terms}</Text>
      </View>

      <Checkbox
        control={control}
        name="agreedToTerms"
        text={t.agreeTerms}
        rules={{ required: t.errorTerms }}
      />

      {/* Data consent */}
      <View className="bg-gray-50 p-4 rounded-2xl mt-4 mb-4">
        <Text className="text-[11px] text-gray-500 leading-5">{t.consentText}</Text>
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
