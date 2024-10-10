import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";

interface ItemPastBidsProps {
  isWin: boolean;
  title: string;
  lotNumber: string;
  description: string;
  estimate: string;
  soldPrice: string;
  maxBid: string;
  id: number;
  status: string;
}

type RootStackParamList = {
  DetailMyBid: {
    isWin: boolean;
    title: string;
    lotNumber: string;
    description: string;
    estimate: string;
    soldPrice: string;
    maxBid: string;
    id: number;
    status: string;
  };
};

const ItemPastBids: React.FC<ItemPastBidsProps> = ({
  isWin,
  title,
  lotNumber,
  description,
  estimate,
  soldPrice,
  maxBid,
  id,
  status,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("DetailMyBid", {
          isWin,
          title,
          lotNumber,
          description,
          estimate,
          soldPrice,
          maxBid,
          id,
          status,
        });
      }}
      className="flex-row flex-1 gap-2 p-4 my-1 bg-white rounded-lg shadow-lg">
      <View className="flex items-center w-[40%]">
        <Image
          className="object-cover w-[100%] h-[200px] rounded-lg"
          source={require("../../../assets/item.jpg")}
        />
        <View
          className={
            isWin ? "bg-[#98C583] p-2 w-[100%]" : "bg-[#C5838F] p-2 w-[100%]"
          }>
          <Text className="text-lg font-bold text-center text-white">
            {isWin ? "You Win !!!" : "You Lose !!!"}
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
          SOLD: <Text className="font-semibold">{soldPrice}</Text>
        </Text>
        <Text className="text-base text-gray-600">
          Your max bid: <Text className="font-semibold">{maxBid}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemPastBids;
