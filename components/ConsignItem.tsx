import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

// Define the status type
type ConsignStatus =
  | "Requested" //0
  | "Assigned" //1
  | "RequestedPreliminary" //2
  | "Preliminary" //3
  | "ApprovedPreliminary" //4
  | "RecivedJewelry" //5
  | "Evaluated" //6
  | "ManagerApproved" //7
  | "Authorized" //8
  | "Rejected"; //9

// Define the props interface
export interface ConsignItemProps {
  id: number;
  name: string;
  minPrice: number | string;
  maxPrice: number | string;
  image: string;
  status: ConsignStatus;
  date: string;
  index: number;
  onViewDetails?: () => void;
}

// Define the status colors
const statusColors: Record<ConsignStatus, string> = {
  Requested: "text-blue-500",
  Assigned: "text-indigo-500",
  RequestedPreliminary: "text-yellow-500",
  Preliminary: "text-pink-500",
  ApprovedPreliminary: "text-green-500",
  RecivedJewelry: "text-purple-500",
  Evaluated: "text-orange-500",
  ManagerApproved: "text-green-700",
  Authorized: "text-blue-500",
  Rejected: "text-red-500",
};

const ConsignItem: React.FC<ConsignItemProps> = ({
  id,
  name,
  minPrice,
  maxPrice,
  status,
  onViewDetails,
  image,
  date,
  index,
}) => {
  const statusColor = statusColors[status] || "text-gray-500";
  const imageLink = image ? image : "https://via.placeholder.com/150";

  const statusTextMap: Record<ConsignStatus, string> = {
    Requested: "Requested",
    Assigned: "Assigned",
    RequestedPreliminary: "Requested Preliminary",
    Preliminary: "Preliminary",
    ApprovedPreliminary: "Approved Preliminary",
    RecivedJewelry: "Recived Jewelry",
    Evaluated: "Evaluated",
    ManagerApproved: "Manager Approved",
    Authorized: "Authorized",
    Rejected: "Rejected",
  };

  return (
    <View className="p-4 mb-2 bg-white rounded-lg shadow">
      <Text className="absolute z-40 px-2 py-1 font-semibold text-white bg-blue-400 rounded-full  top-1 left-2">
        {index + 1}
      </Text>
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
          {minPrice || maxPrice ? (
            <View className="flex-row">
              {minPrice && (
                <Text className="mt-1 mr-2 text-lg font-bold">
                  {minPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              )}
              {maxPrice && (
                <Text className="mt-1 text-lg font-bold">
                  -{" "}
                  {maxPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              )}
            </View>
          ) : null}

          <View className="flex flex-row items-center justify-between">
            <Text className={`${statusColor} uppercase font-semibold w-1/2`}>
              {statusTextMap[status as ConsignStatus]}
            </Text>
            <TouchableOpacity
              onPress={onViewDetails}
              className="w-[45%] p-2 mt-2 bg-gray-600 rounded"
            >
              <Text className="font-semibold text-center text-white">
                VIEW DETAIL
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ConsignItem;
