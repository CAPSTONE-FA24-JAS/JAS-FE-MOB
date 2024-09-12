import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface ConfirmModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmTextColor?: string; // màu cho text "Confirm"
  cancelButtonTextColor?: string; // màu cho text "Cancel"
  message?: string; // Nội dung thông báo
  confirmTitle?: string; // Tiêu đề confirm
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  confirmTextColor = "blue",
  cancelButtonTextColor = "white",
  message = "Are you sure you want to proceed?",
  confirmTitle = "Confirm",
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-10/12 bg-white rounded-lg p-6 items-center">
          {/* Tiêu đề */}
          <Text
            className={`text-2xl font-bold mb-4 text-${confirmTextColor}-600`}
          >
            {confirmTitle}
          </Text>

          {/* Thông báo */}
          <Text className="text-lg text-center mb-4">{message}</Text>

          {/* Các nút xác nhận và hủy */}
          <View className="flex-row justify-evenly w-full">
            {/* Nút Cancel */}
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-500 py-3 px-8 rounded-lg"
            >
              <Text className={`font-semibold text-white`}>Cancel</Text>
            </TouchableOpacity>

            {/* Nút Yes, Continue */}
            <TouchableOpacity
              onPress={onConfirm}
              className={`bg-${confirmTextColor}-500 py-3 px-8 rounded-lg`}
            >
              <Text className={`font-semibold text-white text-base`}>
                Yes, Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
