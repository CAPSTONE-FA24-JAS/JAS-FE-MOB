import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getAutoBidByCustomerLot, updateActiveForAutobid } from "@/api/lotAPI";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

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
  const [editedAutoBids, setEditedAutoBids] = useState<AutoBid[]>([]);

  console.log("====================================");
  console.log("autoBidsne", autoBids);
  console.log("====================================");
  useEffect(() => {
    // Gắn giá trị ban đầu từ props autoBids
    setEditedAutoBids(autoBids);
  }, [autoBids]);

  // Đổi trạng thái Active/Inactive
  const handleStatusChange = (id: number) => {
    setEditedAutoBids((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  // Kiểm tra xem dữ liệu có thay đổi so với ban đầu không
  const isDataChanged = (id: number): boolean => {
    const original = autoBids.find((item) => item.id === id);
    const edited = editedAutoBids.find((item) => item.id === id);
    return original?.isActive !== edited?.isActive;
  };

  const handleSaveStatus = async (id: number, isActive: boolean) => {
    try {
      const success = await updateActiveForAutobid(id, isActive);
      if (success) {
        showSuccessMessage("Status updated successfully!");
        console.log(`Successfully updated status for ID: ${id}`);
        onClose();
      }
    } catch (error) {
      showErrorMessage("Failed to update status.");
      console.error("Error updating status:", error);
    }
  };

  const renderAutoBidItem = ({
    item,
    index,
  }: {
    item: AutoBid;
    index: number;
  }) => {
    const editedItem = editedAutoBids.find((autoBid) => autoBid.id === item.id);

    return (
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
        </View>
        <View className="items-center">
          {/* Dropdown cho trạng thái */}
          <TouchableOpacity
            className={` rounded-md px-3 py-1 ${
              editedItem?.isActive ? "bg-green-500" : "bg-red-500"
            }`}
            onPress={() => handleStatusChange(item.id)}
          >
            <Text className="text-sm text-white">
              {editedItem?.isActive ? "Active" : "Inactive"}
            </Text>
          </TouchableOpacity>
          {/* Nút Save chỉ hiển thị khi dữ liệu thay đổi */}
          {isDataChanged(item.id) && (
            <TouchableOpacity
              onPress={() => handleSaveStatus(item.id, !!editedItem?.isActive)}
              className="py-1 px-3 mt-2 bg-blue-500 rounded-lg"
            >
              <Text className="text-sm text-white">Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

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
