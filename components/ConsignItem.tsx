import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

// Define the status type
type ConsignStatus =
  | "Requested"
  | "Assigned"
  | "RequestedPreliminary"
  | "Preliminary"
  | "ApprovedPreliminary"
  | "Received Jewelry"
  | "Final Valuated"
  | "Manager Approved"
  | "Authorized"
  | "Rejected Preliminary";

// Define the props interface
export interface ConsignItemProps {
  id: number;
  name: string;
  price: number | string;
  image: string;
  status: ConsignStatus;
  date: string;
  onViewDetails?: () => void;
}

// Define the status colors
const statusColors: Record<ConsignStatus, string> = {
  Requested: "text-blue-500",
  Assigned: "text-indigo-500",
  RequestedPreliminary: "text-yellow-500",
  Preliminary: "text-brown-500",
  ApprovedPreliminary: "text-green-500",
  "Received Jewelry": "text-purple-500",
  "Final Valuated": "text-orange-500",
  "Manager Approved": "text-green-700",
  Authorized: "text-blue-500",
  "Rejected Preliminary": "text-red-500",
};

const ConsignItem: React.FC<ConsignItemProps> = ({
  id,
  name,
  price,
  status,
  onViewDetails,
  image,
  date,
}) => {
  const statusColor = statusColors[status] || "text-gray-500";
  const imageLink = image ? image : "https://via.placeholder.com/150";

  return (
    <View className="p-4 mb-2 bg-white rounded-lg shadow">
      <View className="flex-row items-center">
        <Image source={{ uri: imageLink }} className="w-24 h-24 mr-4 rounded" />
        <View className="flex-1">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-xs text-gray-600">
              {new Date(date).toLocaleDateString("en-GB")}
            </Text>
            <Text className="text-gray-600">#{id}</Text>
          </View>
          <Text className="text-lg font-semibold">{name}</Text>
          {price ? (
            <Text className="mt-1 text-lg font-bold">{price}$</Text>
          ) : null}
          {/*
          it take me 2hours to find out why this code doesn't work pls don't do this
          DON'T DO

          widgetNumber === 10 && <MyComponent />
          DO DO
          
          widgetNumber === 10 ? <MyComponent /> : null */}
          <View className="flex flex-row items-center justify-between">
            <Text className={`${statusColor} uppercase font-semibold w-1/2`}>
              {status}
            </Text>
            <TouchableOpacity
              onPress={onViewDetails}
              className="w-[45%] p-2 mt-2 bg-gray-600 rounded">
              <Text className="font-semibold text-center text-white">
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
