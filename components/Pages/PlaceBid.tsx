import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";

export type BidFormRouteParams = {
  lotId: number;
  lotName: string;
  startBid: number;
  estimatedPrice: { min: number; max: number };
};

type BidFormScreenRouteProp = RouteProp<
  { BidForm: BidFormRouteParams },
  "BidForm"
>;

const PlaceBid = () => {
  const navigation = useNavigation();
  const route = useRoute<BidFormScreenRouteProp>();
  const { lotId, lotName, startBid, estimatedPrice } = route.params;
  const [bidAmount, setBidAmount] = useState(startBid);

  const handleIncrease = () => {
    setBidAmount(bidAmount + 100);
  };

  const handleDecrease = () => {
    setBidAmount(Math.max(startBid, bidAmount - 100));
  };

  const handlePlaceBid = () => {
    console.log(`Placed bid of $${bidAmount} for Lot #${lotId}`);
    navigation.goBack();
  };

  return (
    <SafeAreaView className="relative flex-col flex-1 bg-white">
      <View className="flex flex-row gap-5 p-3 bg-slate-100">
        <Image
          className="relative w-1/4 h-20 rounded-lg"
          source={require(".../../../assets/item-jas/item1.jpg")}
        />
        <View>
          <Text className="text-lg font-bold text-gray-800">Lot #{lotId}</Text>
          <Text className="text-base text-gray-600">{lotName}</Text>
          <Text className="text-sm text-gray-500">
            Est: US${estimatedPrice.min} - US${estimatedPrice.max}
          </Text>
        </View>
      </View>

      <View className="justify-center flex-1 gap-4 p-4">
        <Text className="text-lg font-semibold text-gray-700">Your Bid:</Text>
        <View className="flex-row items-center w-full">
          <TouchableOpacity
            onPress={handleDecrease}
            className="px-4 py-3 bg-gray-200 rounded-l">
            <Text className="text-xl font-bold">-</Text>
          </TouchableOpacity>
          <View className="w-4/5 px-4 py-3 bg-gray-100">
            <Text className="text-lg font-bold">${bidAmount}</Text>
          </View>
          <TouchableOpacity
            onPress={handleIncrease}
            className="px-4 py-3 bg-gray-200 rounded-r">
            <Text className="text-xl font-bold">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={handlePlaceBid}
        className="absolute bottom-0 left-0 right-0 py-3 bg-blue-500 rounded-sm">
        <Text className="text-lg font-semibold text-center text-white">
          PLACE BID
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PlaceBid;
