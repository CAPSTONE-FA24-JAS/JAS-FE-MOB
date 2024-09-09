import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

type RootStackParamList = {
  LotDetailScreen: undefined;
};

const ItemLots = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const router = useRouter();
  const goToAuctionDetail = () => {
    navigation.navigate("LotDetailScreen"); // Navigate back to Home
  };
  return (
    <TouchableOpacity className="w-[47%] mb-5" onPress={goToAuctionDetail}>
      <View className="flex-1 p-1 bg-[#FAFAFA]">
        <Image
          className="w-[100%] h-[200px] rounded-sm "
          source={require("../assets/item.jpg")}
        />
        <View className="flex gap-2">
          <Text className="ml-4 text-sm font-bold text-[#8f8f8f] ">
            Lot #101
          </Text>
          <Text className="ml-4 text-xs font-bold text-black ">
            Lalaounis Chimera Chocker
          </Text>
          <Text className="ml-4 text-xs text-[#6c6c6c] ">
            Est: US$3500 - US$4000
          </Text>
          <Text className="ml-4 text-xs font-bold text-[#6c6c6c] ">
            Start Bid: <Text className="font-normal">US$2600</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemLots;
