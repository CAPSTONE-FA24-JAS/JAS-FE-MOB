import React from "react";
import { Modal, View, Text, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface AuctionResultModalProps {
  visible: boolean;
  onClose: () => void;
  userWinner: string;
  winningPrice: string;
  currentUser: string;
}

const AuctionResultModal: React.FC<AuctionResultModalProps> = ({
  visible,
  onClose,
  userWinner,
  winningPrice,
  currentUser,
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
          <Icon
            name={currentUser === userWinner ? "trophy" : "information"}
            size={60}
            color={currentUser === userWinner ? "#FFD700" : "#4A90E2"}
            className="mb-4"
          />

          {/* Title Section */}
          <Text className="mb-6 text-2xl font-bold text-center text-gray-800">
            {currentUser === userWinner
              ? "Chúc mừng bạn đã thắng!"
              : "Phiên đấu giá đã kết thúc"}
          </Text>

          {/* Info Section */}
          <View className="w-full p-4 mb-6 bg-gray-50 rounded-xl">
            <View className="flex-row items-center justify-between mb-2">
              <View className="text-base font-medium text-gray-600">
                Người thắng cuộc:
              </View>
              <Text className="text-base font-semibold text-blue-500">
                {currentUser === userWinner ? "Bạn" : userWinner}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-base font-medium text-gray-600">
                Giá thắng:
              </Text>
              <Text className="text-base font-bold text-green-600">
                {winningPrice}
              </Text>
            </View>
          </View>

          {/* Message Section */}
          <Text className="mb-6 text-sm italic text-center text-gray-500">
            {currentUser === userWinner
              ? "Xin chúc mừng! Bạn đã thắng phiên đấu giá này. Vui lòng kiểm tra email để biết thêm chi tiết về các bước tiếp theo."
              : "Cảm ơn bạn đã tham gia đấu giá. Hẹn gặp lại bạn trong những phiên đấu giá tiếp theo!"}
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

export default AuctionResultModal;
