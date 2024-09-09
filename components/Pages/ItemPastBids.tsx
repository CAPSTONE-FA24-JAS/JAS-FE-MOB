import React from "react";
import { View, Image, Text } from "react-native";

interface ItemPastBidsProps {
  isWin: boolean; // State để xác định trạng thái
}

const ItemPastBids: React.FC<ItemPastBidsProps> = ({ isWin }) => {
  return (
    <View className="flex-row flex-1 gap-2 my-1">
      <View className="flex items-center w-[40%]">
        <Image
          className="object-cover w-[100%] h-[200px] rounded-lg"
          source={require("../../assets/item.jpg")}
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

      <View>
        <Text className="text-lg font-bold">Fine Jewels</Text>
        <Text className="text-lg font-bold">Lot #102</Text>
        <Text className="flex-shrink text-lg font-bold">
          Breitling Colt Chronograph in Steelssssssssssssssssssss
        </Text>
        <Text className="text-lg font-bold">Est: US3500 - US4000</Text>
        <Text className="text-lg font-bold">SOLD: 3200$</Text>
        <Text className="text-lg font-bold">Your max bid: US3200</Text>
      </View>
    </View>
  );
};

export default ItemPastBids;
