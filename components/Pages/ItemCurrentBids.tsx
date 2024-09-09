import React from "react";
import { View, Image, Text } from "react-native";

interface ItemCurrentBidsProps {
  isLive: boolean; // State để xác định trạng thái
}

const ItemCurrentBids: React.FC<ItemCurrentBidsProps> = ({ isLive }) => {
  return (
    <View className="flex-row flex-1 gap-2 my-1 bg-slate-200">
      <View className="flex items-center w-[40%] ">
        <Image
          className="object-cover w-[100%] h-[200px] "
          source={require("../../assets/item.jpg")}
        />
        <View
          className={
            isLive ? "bg-red-800 p-2 w-[100%]" : "bg-lime-800 p-2 w-[100%]"
          }>
          <Text className="text-lg font-bold text-center text-white">
            {isLive ? "Live Bidding" : "Comming Soon"}
          </Text>
          <Text className="font-bold text-center text-white">
            12 September 2024 22:00 GMT +7 Left
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
      </View>
    </View>
  );
};

export default ItemCurrentBids;
