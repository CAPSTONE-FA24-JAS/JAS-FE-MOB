import React from "react";
import { View, Text, FlatList, ListRenderItem } from "react-native";
import { ItemWatched, WatchedItem } from "./ItemWatched";

const ItemWatchedCurrent: React.FC = () => {
  const watchedItems: WatchedItem[] = [
    {
      lot: 102,
      title: "Breitling Colt Chrosas in Steel",
      estimate: "Est: US$700 - US$900",
      status: "SOLD",
    },
    {
      lot: 102,
      title: "Breitling Colt Chro...",
      estimate: "Est: US$700 - US$900",
      status: "PASSED",
    },
    // Add more items as needed
  ];

  const renderItem: ListRenderItem<WatchedItem> = ({ item }) => (
    <ItemWatched item={item} />
  );

  return (
    <View className="flex-1">
      <FlatList
        data={watchedItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        className="bg-white"
      />
    </View>
  );
};

export default ItemWatchedCurrent;
