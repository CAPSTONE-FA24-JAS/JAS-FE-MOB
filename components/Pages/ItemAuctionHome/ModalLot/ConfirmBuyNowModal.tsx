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
      <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
        <View className="bg-white p-6 rounded-lg w-90">
          <Text className="text-lg font-bold text-blue-500 mb-4 uppercase ">
            Confirm Purchase
          </Text>
          <Text className="text-base mb-6 font-semibold text-gray-600">
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
              className="px-4 py-2 w-[45%] bg-gray-300 rounded"
            >
              <Text className="text-black  text-center font-semibold">No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="px-4 py-2 w-[45%] bg-blue-500 rounded"
            >
              <Text className="text-white text-center font-semibold">Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmBuyNowModal;
