import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getAutoBidByCustomerLot } from "@/api/lotAPI";
import { showErrorMessage } from "@/components/FlashMessageHelpers";

interface AutoBid {
  id: number;
  minPrice: number;
  maxPrice: number;
  numberOfPriceStep: number;
  timeIncrement: number;
  isActive: boolean;
  customerLotId: number;
}

interface AutoBidHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  customerLotId: number;
  loading: boolean;
  autoBids: AutoBid[];
}

const AutoBidHistoryModal: React.FC<AutoBidHistoryModalProps> = ({
  visible,
  onClose,
  customerLotId,
  loading,
  autoBids,
}) => {
  const renderAutoBidItem = ({
    item,
    index,
  }: {
    item: AutoBid;
    index: number;
  }) => (
    <View className="flex-row items-center justify-between p-3 bg-gray-100 mb-2 rounded-md">
      <Text className="text-gray-700">#{index + 1}</Text>
      <View className="flex-1 ml-4">
        <Text className="font-bold text-black">
          Max Price:{" "}
          {item.maxPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
        <Text className=" text-gray-500">
          Min Price:{" "}
          {item.minPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
        <Text className="text-gray-500">
          Price Steps: {item.numberOfPriceStep}
        </Text>
        <Text className="text-gray-500">
          Time Increment: {item.timeIncrement} seconds
        </Text>
        <Text
          className={`text-gray-500 ${
            item.isActive ? "text-green-500" : "text-red-500"
          }`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View className="flex-1 bg-black/50 bg-opacity-50 justify-center">
        <View className="bg-white mx-6 rounded-lg p-4  max-h-[70%] ">
          <Text className="text-lg font-bold mb-4 text-center">
            AutoBid History
          </Text>
          {loading ? null : autoBids.length > 0 ? (
            <FlatList
              data={autoBids}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderAutoBidItem}
            />
          ) : (
            <Text className="text-center text-gray-500">
              No AutoBid history found.
            </Text>
          )}
          <TouchableOpacity
            onPress={onClose}
            className="py-2 mt-4 bg-red-500 rounded-lg"
          >
            <Text className="text-center text-white font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AutoBidHistoryModal;
