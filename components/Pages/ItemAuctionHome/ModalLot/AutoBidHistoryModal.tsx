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

interface AutoBidHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  customerLotId: number;
}

const AutoBidHistoryModal: React.FC<AutoBidHistoryModalProps> = ({
  visible,
  onClose,
  customerLotId,
}) => {
  interface AutoBid {
    id: number;
    minPrice: number;
    maxPrice: number;
    numberOfPriceStep: number;
    timeIncrement: number;
    isActive: boolean;
    customerLotId: number;
  }

  const [autoBids, setAutoBids] = useState<AutoBid[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && customerLotId) {
      fetchAutoBids();
    }
  }, [visible, customerLotId]);

  const fetchAutoBids = async () => {
    setLoading(true);
    try {
      const data = await getAutoBidByCustomerLot(customerLotId);
      if (data) {
        // Sắp xếp autoBids theo ID mới nhất lên đầu
        const sortedData = data.sort((a, b) => b.id - a.id);
        setAutoBids(sortedData);
      }
    } catch (error) {
      showErrorMessage("Unable to fetch AutoBid history.");
    } finally {
      setLoading(false);
    }
  };

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
          Min Price:{" "}
          {item.minPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
        <Text className="text-gray-500">
          Max Price:{" "}
          {item.maxPrice.toLocaleString("vi-VN", {
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
      <View className="flex-1 bg-black bg-opacity-50 justify-center">
        <View className="bg-white mx-6 rounded-lg p-4">
          <Text className="text-lg font-bold mb-4 text-center">
            AutoBid History
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : autoBids.length > 0 ? (
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
