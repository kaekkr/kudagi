import { KuDagiOrder } from "@kudagi/core";
import { useState } from "react";
import { Pressable, View, Text, ActivityIndicator } from "react-native";

export const PaymentControls = ({
  order,
  onPaymentChange,
}: {
  order: KuDagiOrder;
  onPaymentChange: (flags: { deposit?: boolean; full?: boolean }) => void;
}) => {
  const [isDepositConfirmed, setIsDepositConfirmed] = useState(order.depositPaid);
  const [isFullConfirmed, setIsFullConfirmed] = useState(order.fullPaid);
  const [pendingFlag, setPendingFlag] = useState<"deposit" | "full" | null>(null);

  const handleConfirmDeposit = async () => {
      if (isDepositConfirmed) return;
      setPendingFlag("deposit");
      try {
        await onPaymentChange({ deposit: true }); // ← no status string anymore
        setIsDepositConfirmed(true);
      } catch (e) {
        console.error(e);
      } finally {
        setPendingFlag(null);
      }
    };

    const handleConfirmFull = async () => {
      if (isFullConfirmed) return;
      setPendingFlag("full");
      try {
        await onPaymentChange({ full: true });
        setIsFullConfirmed(true);
      } catch (e) {
        console.error(e);
      } finally {
        setPendingFlag(null);
      }
    };

    return (
      <View className="mt-2">
        <Text className="text-gray-400 text-[10px] font-bold uppercase mb-2 ml-1">
          Действие с оплатой
        </Text>

        <PaymentButton
          label="Предоплата"
          isPaid={isDepositConfirmed}
          isLoading={pendingFlag === "deposit"}
          onPress={handleConfirmDeposit}
        />

        <PaymentButton
          label="Полная оплата"
          isPaid={isFullConfirmed}
          isLoading={pendingFlag === "full"}
          onPress={handleConfirmFull}
        />
      </View>
    );
};

const PaymentButton = ({
  label,
  isPaid,
  isLoading,
  onPress,
}: {
  label: string;
  isPaid: boolean;
  isLoading?: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    disabled={isPaid || isLoading} // ← derived here, not passed from outside
    hitSlop={10}
    style={({ pressed }) => ({ opacity: pressed && !isPaid ? 0.7 : 1 })}
    className={`p-4 rounded-2xl flex-row justify-between items-center border ${
      isPaid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
    } mb-3`}
  >
    <View className="flex-1">
      <Text className={`text-[10px] uppercase font-black ${isPaid ? "text-green-600" : "text-red-400"}`}>
        {label}
      </Text>
      <Text className={`text-base font-bold ${isPaid ? "text-green-800" : "text-red-800"}`}>
        {isPaid ? "✓ Подтверждена" : "✗ Не подтверждена"}
      </Text>
    </View>

    <View className="flex-row items-center">
      {isLoading ? (
        <ActivityIndicator size="small" color={isPaid ? "#16A34A" : "#EF4444"} />
      ) : (
        <View className={`px-4 py-2 rounded-full ${isPaid ? "bg-green-500" : "bg-red-500"}`}>
          <Text className="text-white text-[10px] font-black">
            {/* ← no more "ОТМЕНИТЬ" — button is disabled when paid anyway */}
            {isPaid ? "✓ ГОТОВО" : "ПОДТВЕРДИТЬ"}
          </Text>
        </View>
      )}
    </View>
  </Pressable>
);
