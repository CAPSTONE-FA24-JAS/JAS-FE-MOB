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
        });
      }}
      className="flex-row flex-1 gap-2 my-1"
    >
      <View className="flex items-center w-[40%]">
        <Image
          className="object-cover w-[100%] h-[200px] rounded-lg"
          source={require("../../../assets/item.jpg")}
        />
        <View
          className={
            isWin ? "bg-[#98C583] p-2 w-[100%]" : "bg-[#C5838F] p-2 w-[100%]"
          }
        >
          <Text className="text-lg font-bold text-center text-white">
            {isWin ? "You Win !!!" : "You Lose !!!"}
          </Text>
        </View>
      </View>

      <View className="w-[60%]">
        <Text className="text-lg font-bold">{title}</Text>
        <Text className="text-lg font-bold">{lotNumber}</Text>
        <Text className="flex-shrink text-lg font-bold">{description}</Text>
        <Text className="text-lg font-bold">Est: {estimate}</Text>
        <Text className="text-lg font-bold">SOLD: {soldPrice}</Text>
        <Text className="text-lg font-bold">Your max bid: {maxBid}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemPastBids;
