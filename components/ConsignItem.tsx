import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export interface ConsignItemProps {
  id: string;
  name: string;
  price: number;
  status: "APPROVED" | "REJECTED" | "PENDING";
  onViewDetails?: () => void; // Include onViewDetails in the props
}

const statusColors = {
  APPROVED: "text-green-500",
  REJECTED: "text-red-500",
  PENDING: "text-yellow-500",
};

const ConsignItem: React.FC<ConsignItemProps> = ({
  id,
  name,
  price,
  status,
  onViewDetails,
}) => {
  return (
    <View className="p-4 mb-2 bg-white rounded-lg shadow">
      <View className="flex-row items-center">
        <Image
          source={require("../assets/item-jas/item1.jpg")}
          className="w-24 h-full mr-4 rounded"
        />
        <View className="flex-1">
          <View className="flex flex-row items-center justify-between p-1">
            <Text className="text-lg font-semibold">{name}</Text>
            <Text className="text-gray-600">#{id}</Text>
          </View>

          <Text className="mt-1 text-lg font-bold">${price.toFixed(2)}</Text>
          <View className="flex flex-row items-center justify-between p-1">
            <Text className={`${statusColors[status]} uppercase font-semibold`}>
              {status}
            </Text>
            <TouchableOpacity
              onPress={onViewDetails}
              className="w-2/3 p-2 mt-2 bg-gray-200 rounded">
              <Text className="text-center text-gray-700">XEM CHI TIẾT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ConsignItem;
