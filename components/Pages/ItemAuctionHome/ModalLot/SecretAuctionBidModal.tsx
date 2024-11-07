// components/Modals/SecretAuctionBidModal.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";

interface SecretAuctionBidModalProps {
  isVisible: boolean;
  onClose: () => void;
  minPrice: number;
  onSubmit: (bidAmount: number) => void;
}

const SecretAuctionBidModal: React.FC<SecretAuctionBidModalProps> = ({
  isVisible,
  onClose,
  minPrice,
  onSubmit,
}) => {
  console.log("SecretAuctionBidModalProps", minPrice);

  const [bidAmount, setBidAmount] = useState<number>(minPrice);

  const increaseBid = () => setBidAmount((prev) => prev + 1);
  const decreaseBid = () =>
    setBidAmount((prev) => (prev > minPrice ? prev - 1 : prev));

  const handleBidChange = (value: string) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue) && numericValue >= minPrice) {
      setBidAmount(numericValue);
    }
  };

  const handleSubmit = () => {
    console.log("jhfgiklhki");
    
    onSubmit(bidAmount);
    setBidAmount(minPrice); // Reset to minPrice after submission
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
        <View className="bg-white p-6 rounded-lg w-[90%]">
          <Text className="text-lg font-bold mb-4 text-center text-blue-500 uppercase">
            Enter Your Bid
          </Text>
          <Text className="text-base mb-4 font-semibold  text-center text-gray-600">
            Minimum bid:{" "}
            {minPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
          <View className="flex-row items-center justify-center mb-6">
            <TouchableOpacity
              onPress={decreaseBid}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              <Text className="text-black">-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(bidAmount)}
              onChangeText={handleBidChange}
            />
            <TouchableOpacity
              onPress={increaseBid}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              <Text className="text-black">+</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-around">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 bg-gray-300 w-[45%] rounded"
            >
              <Text className="text-black text-center font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              className="px-4 py-2 bg-blue-500 w-[45%]  rounded"
            >
              <Text className="text-white text-center font-semibold">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginHorizontal: 10,
    textAlign: "center",
    width: 80,
    borderRadius: 4,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SecretAuctionBidModal;
