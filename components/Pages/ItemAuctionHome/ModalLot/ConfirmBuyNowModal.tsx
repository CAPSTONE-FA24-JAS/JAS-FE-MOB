// components/Modals/ConfirmBuyNowModal.tsx

import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

interface ConfirmBuyNowModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  price: number;
  lotId: number;
}

const ConfirmBuyNowModal: React.FC<ConfirmBuyNowModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  price,
  lotId,
}) => {
  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View className="items-center justify-center flex-1 bg-opacity-50 bg-black/50">
        <View className="p-6 bg-white rounded-lg w-90">
          <Text className="mb-4 text-lg font-bold text-blue-500 uppercase ">
            Confirm Purchase
          </Text>
          <Text className="mb-6 text-base font-semibold text-gray-600">
            Are you sure you want to buy lot #{lotId} for{" "}
            {price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
            ?
          </Text>
          <View className="flex-row justify-around">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 w-[45%] bg-gray-300 rounded">
              <Text className="font-semibold text-center text-black">No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="px-4 py-2 w-[45%] bg-blue-500 rounded">
              <Text className="font-semibold text-center text-white">Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmBuyNowModal;
