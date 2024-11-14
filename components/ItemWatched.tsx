import { WatchingData } from "@/app/types/watching_type";
import React from "react";
import { View, Text, Image } from "react-native";

export interface WatchedItem {
  lot: number;
  title: string;
  estimate: string;
  status: "SOLD" | "PASSED";
}

interface ItemWatchedProps {
  item: WatchingData;
}

export const ItemWatched: React.FC<ItemWatchedProps> = ({ item }) => (
  <View className="w-[48%] m-1 rounded-md p-2 border-2 border-gray-100 ">
    <Image
      source={{ uri: item.jewelryDTO.imageJewelries[0].imageLink }}
      className="w-full h-48 mb-2 rounded-lg"
      resizeMode="cover"
    />
    <Text className="text-xs font-semibold text-right text-gray-600">
      Yewelry #{item.jewelryId}
    </Text>
    <Text className="mb-1 text-sm font-bold" numberOfLines={1}>
      {item.jewelryDTO.name}
    </Text>
    <Text className="text-xs text-gray-600">
      {item.jewelryDTO.estimatePriceMin} - {item.jewelryDTO.estimatePriceMin}
    </Text>
    {/* <Text
      className={`font-bold text-xs mt-1 ${
        item.status === "SOLD" ? "text-green-600" : "text-red-600"
      }`}
    >
      {item.status}
    </Text> */}
  </View>
);
