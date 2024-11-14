import React from "react";
import { View, FlatList, ListRenderItem } from "react-native";
import { ItemWatched, WatchedItem } from "./ItemWatched";
import { WatchingData } from "@/app/types/watching_type";

interface ItemWatchedCurrentProps {
  watching: WatchingData[];
}

const ItemWatchedCurrent: React.FC<ItemWatchedCurrentProps> = ({
  watching,
}) => {
  const renderItem: ListRenderItem<WatchingData> = ({ item }) => (
    <ItemWatched item={item} />
  );

  return (
    <View className="flex-1 bg-white p-2">
      <FlatList
        data={watching}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

export default ItemWatchedCurrent;
