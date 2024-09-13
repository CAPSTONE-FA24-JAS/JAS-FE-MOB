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
      onRequestClose={onClose}>
      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="items-center w-10/12 p-6 bg-white rounded-lg">
          {/* Tiêu đề */}
          <Text
            className={`text-2xl font-bold mb-4 text-${confirmTextColor}-600`}>
            {confirmTitle}
          </Text>

          {/* Thông báo */}
          <Text className="mb-4 text-lg text-center">{message}</Text>

          {/* Các nút xác nhận và hủy */}
          <View className="flex-row w-full justify-evenly">
            {/* Nút Cancel */}
            <TouchableOpacity
              onPress={onClose}
              className="px-8 py-3 bg-gray-500 rounded-lg">
              <Text className={`font-semibold text-white`}>Cancel</Text>
            </TouchableOpacity>

            {/* Nút Yes, Continue */}
            <TouchableOpacity
              onPress={onConfirm}
              className={`bg-${confirmTextColor}-500 py-3 px-8 rounded-lg`}>
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
