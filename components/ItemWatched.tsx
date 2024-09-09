import React from "react";
import { View, Text, Image, FlatList, ListRenderItem } from "react-native";

export interface WatchedItem {
  lot: number;
  title: string;
  estimate: string;
  status: "SOLD" | "PASSED";
}

interface ItemWatchedProps {
  item: WatchedItem;
}

export const ItemWatched: React.FC<ItemWatchedProps> = ({ item }) => (
  <View className="w-1/2 p-2 mr-2 bg-slate-50 ">
    <Image
      source={require("../assets/item.jpg")}
      className="w-full h-48 mb-2 aspect-square"
    />
    <Text className="text-xs text-gray-600">Lot {item.lot}</Text>
    <Text className="mb-1 text-sm font-bold" numberOfLines={1}>
      {item.title}
    </Text>
    <Text className="text-xs text-gray-600">{item.estimate}</Text>
    <Text
      className={`font-bold text-xs ${
        item.status === "SOLD" ? "text-green-600" : "text-red-600"
      }`}>
      {item.status}
    </Text>
  </View>
);
