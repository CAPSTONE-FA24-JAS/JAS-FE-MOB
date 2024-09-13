import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import ConsignItem, { ConsignItemProps } from "@/components/ConsignItem";
import { router, useNavigation } from "expo-router";

const HistoryItemConsign: React.FC = () => {
  const navigation = useNavigation();

  const items: ConsignItemProps[] = [
    {
      id: "12345",
      name: "Đồng Hồ Đẹp Nha",
      price: 3000,
      status: "APPROVED" as const,
    },
    {
      id: "12345",
      name: "Đồng Hồ Đẹp Nha",
      price: 3000,
      status: "APPROVED" as const,
    },
    {
      id: "12345",
      name: "Đồng Hồ Đẹp Nha",
      price: 3000,
      status: "REJECTED" as const,
    },
    {
      id: "12345",
      name: "Đồng Hồ Đẹp Nha",
      price: 1000,
      status: "PENDING" as const,
    },
    {
      id: "12345",
      name: "Đồng Hồ Đẹp Nha",
      price: 1000,
      status: "PENDING" as const,
    },
    {
      id: "12345",
      name: "Đồng Hồ Đẹp Nha",
      price: 1000,
      status: "PENDING" as const,
    },
  ];
  return (
    <View className="flex-1 bg-gray-100">
      <View className="relative px-4 py-2">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity className="px-4 py-2 mr-2 bg-gray-800 rounded">
            <Text className="text-white">ALL</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-4 py-2 mr-2 bg-yellow-500 rounded">
            <Text className="text-white">PENDING</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-4 py-2 mr-2 bg-green-500 rounded">
            <Text className="text-white">APPROVED</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-4 py-2 bg-red-500 rounded">
            <Text className="text-white">REJECT</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          className="p-2 mb-4 bg-white rounded"
          placeholder="Search..."
        />
        <FlatList
          className="h-[70vh]"
          data={items}
          renderItem={({ item }) => (
            <ConsignItem
              {...item}
              onViewDetails={() => navigation.navigate("ConsignDetailTimeLine")}
              // sos fix hộ cái typescript lỏ này giúp tôi với
            />
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
        />
        <TouchableOpacity className="w-full p-3 mt-4 bg-gray-800 rounded ">
          <Text className="text-center text-white">XEM THÊM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HistoryItemConsign;
