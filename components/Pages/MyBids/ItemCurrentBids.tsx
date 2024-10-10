import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";

interface ItemCurrentBidsProps {
  isLive: boolean;
  title: string;
  lotNumber: string;
  description: string;
  estimate: string;
  currentBid: string;
  timeLeft: string;
  id: number;
  endTime: string;
}

type RootStackParamList = {
  DetailCurrentBid: {
    isLive: boolean;
    title: string;
    lotNumber: string;
    description: string;
    estimate: string;
    currentBid: string;
    timeLeft: string;
    id: number;
    endTime: string;
  };
};

const ItemCurrentBids: React.FC<ItemCurrentBidsProps> = ({
  isLive,
  title,
  lotNumber,
  description,
  estimate,
  currentBid,
  timeLeft,
  id,
  endTime,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => {
        console.log("lotNumber", lotNumber);
      }}
      className="flex-row flex-1 gap-2 p-4 my-1 bg-white rounded-lg shadow-lg">
      <View className="flex items-center w-[40%]">
        <Image
          className="w-[100%] h-[200px] rounded-lg"
          source={require("../../../assets/item.jpg")}
        />
        <View
          className={
            isLive ? "bg-red-600 p-2 w-[100%]" : "bg-[#98C583] p-2 w-[100%]"
          }>
          <Text className="text-lg font-bold text-center text-white">
            {isLive ? "Live Bidding" : "Coming Soon"}
          </Text>
          <Text className="text-sm font-bold text-center text-white">
            {timeLeft} left
          </Text>
        </View>
      </View>

      <View className="w-[60%]">
        <Text className="text-xl font-bold">{title}</Text>
        <Text className="text-lg font-semibold text-gray-600">{lotNumber}</Text>
        <Text className="mt-1 text-lg font-bold">{description}</Text>
        <Text className="mt-1 text-base text-gray-600">
          Est: <Text className="font-semibold">{estimate}</Text>
        </Text>
        <Text className="text-base text-gray-600">
          Current: <Text className="font-semibold">{currentBid}</Text>
        </Text>
        <Text className="text-base text-gray-600">
          Your Bid: <Text className="font-semibold">{currentBid}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemCurrentBids;
