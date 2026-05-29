import { KuDagiOrder } from "@kudagi/core";
import { View, Modal, Text, Pressable } from "react-native";

interface Props {
  duplicateOrder: KuDagiOrder | null
  onClose: () => void
  onProceed: () => void
}

export const DuplicateOrderModal = ({
  duplicateOrder,
  onClose,
  onProceed,
}: Props) => {
  return (
    <Modal
      visible={!!duplicateOrder}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center px-6">
        <View className="bg-white rounded-3xl p-6">
          <View className="w-14 h-14 bg-orange-100 rounded-full items-center justify-center self-center mb-4">
            <Text className="text-2xl">⚠️</Text>
          </View>

          <Text className="text-lg font-bold text-center text-gray-800 mb-2">
            Такой заказ уже существует
          </Text>

          <Text className="text-sm text-gray-500 text-center mb-5">
            Заказ с таким названием и номером телефона уже был оформлен ранее.
          </Text>

          {duplicateOrder && (
            <View className="bg-gray-50 rounded-2xl p-4 mb-5">
              <Text className="text-xs text-gray-400 mb-1">Существующий заказ</Text>
              <Text className="font-bold text-gray-800">«{duplicateOrder.orderName}»</Text>
              <Text className="text-sm text-gray-500">
                {duplicateOrder.clientName} · {duplicateOrder.phone}
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

          <Pressable
            onPress={onClose}
            className="bg-[#C5A059] py-4 rounded-2xl mb-3"
          >
            <Text className="text-white font-bold text-center">Изменить заказ</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
