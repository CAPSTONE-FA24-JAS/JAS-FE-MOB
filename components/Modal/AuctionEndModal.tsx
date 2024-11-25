import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface AuctionEndedModalProps {
  visible: boolean;
  onClose: () => void;
}

const AuctionEndedModal: React.FC<AuctionEndedModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View className="items-center justify-center flex-1 px-4 bg-black/50">
        <View className="items-center w-full p-6 bg-white shadow-lg rounded-3xl">
          {/* Icon Section */}
          <Icon name="clock-end" size={60} color="#4A90E2" className="mb-4" />

          {/* Title Section */}
          <Text className="mb-6 text-2xl font-bold text-center text-gray-800">
            Phiên đấu giá đã kết thúc
          </Text>

          {/* Message Section */}
          <Text className="mb-6 text-base text-center text-gray-500">
            Phiên đấu giá này đã kết thúc. Vui lòng quay lại sau để tham gia các
            phiên đấu giá khác.
          </Text>

          <TouchableOpacity
            className="w-full px-6 py-3 bg-blue-500 rounded-full active:bg-blue-600"
            onPress={onClose}>
            <Text className="text-base font-semibold text-center text-white">
              Đóng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AuctionEndedModal;
