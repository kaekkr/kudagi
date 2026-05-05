import { View, Text, Pressable, ActivityIndicator } from "react-native";

interface NavigationFooterProps {
  step: number;
  t: any;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  loading?: boolean;
}

export const NavigationFooter = ({
  step, t, onNext, onBack, onSubmit, loading = false,
}: NavigationFooterProps) => {
  return (
    <View className="mt-8">
      <Pressable
        onPress={step < 4 ? onNext : onSubmit}
        disabled={loading}
        className="bg-[#C5A059] p-5 rounded-2xl items-center shadow-sm active:opacity-90"
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg uppercase tracking-wider">
            {step === 4 ? t.placeOrder : t.continue}
          </Text>
        )}
      </Pressable>
      {step > 1 && (
        <Pressable onPress={onBack} className="mt-4 py-2 self-center active:opacity-60">
          <Text className="text-gray-400 font-medium">{t.goBack}</Text>
        </Pressable>
      )}
    </View>
  );
};
