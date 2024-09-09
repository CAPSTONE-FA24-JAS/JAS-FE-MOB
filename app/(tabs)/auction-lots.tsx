import ItemLots from "@/components/ItemLots";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

const AuctionLots = () => {
  return (
    <ScrollView className="bg-white">
      <View className="bg-red-600">
        <Text className="text-center text-white">Bid 13th 2min 56s Left</Text>
      </View>
      <View className="flex flex-row justify-around py-3 searchbar">
        <TextInput
          placeholder="Search"
          className="border-[1px] border-slate-300 px-4 rounded-lg text-sm w-7/12 ml-3"
        />
        <TouchableOpacity className="flex items-center justify-center w-2/12 rounded-md bg-slate-200">
          <Text className="text-center">Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex items-center justify-center w-2/12 rounded-md bg-slate-200">
          <Text className="text-center">Sort</Text>
        </TouchableOpacity>
      </View>
      <View className="flex flex-row flex-wrap justify-around listLots">
        <ItemLots />
        <ItemLots />
        <ItemLots />
        <ItemLots />
        <ItemLots />
        <ItemLots />
        <ItemLots />
        <ItemLots />
        <ItemLots />
        <ItemLots />
        <ItemLots />
        <ItemLots />
      </View>
    </ScrollView>
  );
};

export default AuctionLots;
