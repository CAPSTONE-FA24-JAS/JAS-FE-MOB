import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export interface ConsignItemProps {
  id: number;
  name: string;
  price: number;
  image: string;
  status:
    | "ALL"
    | "Preliminary Valued"
    | "Requested"
    | "Product received"
    | "Pending manager approved"
    | "Manager approved"
    | "Member accepted"
    | "Approved"
    | "Rejected";
  onViewDetails?: () => void; // Include onViewDetails in the props
}

// Cập nhật statusColors cho tất cả trạng thái
const statusColors: { [key: string]: string } = {
  "Preliminary Valued": "text-yellow-500",
  Requested: "text-blue-500",
  "Product received": "text-purple-500",
  "Pending manager approved": "text-orange-500",
  "Manager approved": "text-green-700",
  "Member accepted": "text-blue-500",
  Approved: "text-green-300",
  Rejected: "text-red-500",
};

const ConsignItem: React.FC<ConsignItemProps> = ({
  id,
  name,
  price,
  status,
  onViewDetails,
  image,
}) => {
  // Xử lý trạng thái không tồn tại trong statusColors
  const statusColor = statusColors[status] || "text-gray-500";
  const imageLink = image || "https://via.placeholder.com/150";

  return (
    <View className="p-4 mb-2 bg-white rounded-lg shadow">
      <View className="flex-row items-center">
        {imageLink ? (
          <Image
            source={{ uri: imageLink }}
            className="w-24 h-full mr-4 rounded"
          />
        ) : (
          <Image
            source={require("../assets/item-jas/item1.jpg")}
            className="w-24 h-full mr-4 rounded"
          />
        )}

        <View className="flex-1">
          <View className="flex flex-row items-center justify-between  ">
            <Text className="text-xs text-gray-600 ">12:00, 20/12/2024</Text>
            <Text className="text-gray-600">#{id}</Text>
          </View>
          <Text className="text-lg font-semibold ">{name}</Text>

          {price && <Text className="mt-1 text-lg font-bold">${price}</Text>}
          <View className="flex flex-row items-center justify-between ">
            <Text className={`${statusColor} uppercase font-semibold w-1/2`}>
              {status}
            </Text>
            <TouchableOpacity
              onPress={onViewDetails}
              className="w-[45%] p-2 mt-2 bg-gray-600 rounded"
            >
              <Text className="text-center text-white font-semibold">
                XEM CHI TIẾT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ConsignItem;
