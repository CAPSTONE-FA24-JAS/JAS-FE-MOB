import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface ItemBidCardProps {
  isWin: boolean;
  title: string;
  lotNumber: string;
  description: string;
  estimate: string;
  soldPrice: string;
  maxBid: string;
  id: number;
  statusColor: string;
}

const ItemBidCard: React.FC<ItemBidCardProps> = ({
  isWin,
  statusColor,
  title,
  lotNumber,
  description,
  estimate,
  soldPrice,
  maxBid,
}) => {
  return (
    <View className="p-4  bg-white my-2 mx-4 rounded-lg shadow">
      <View className="flex-row ">
        {/* {imageLink ? (
          <Image
            source={{ uri: imageLink }}
            className="w-24 h-full mr-4 rounded"
          />
        ) : ( */}
        <Image
          source={require("../../../../assets/item-jas/item1.jpg")}
          className="w-24 h-24 mr-4 rounded"
        />
        {/* )} */}

        <View className="flex-1">
          <View className="flex flex-row items-center justify-between  ">
            <Text className="text-xs text-gray-600 ">12:00, 20/12/2024</Text>
            <Text className="text-gray-600">{lotNumber}</Text>
          </View>
          <Text className="text-lg font-semibold ">{title}</Text>
          <View className="flex-row justify-between">
            <View>
              <View className="flex flex-row items-center gap-2 ">
                <Text
                  className={`${statusColor} uppercase font-semibold text-sm `}
                >
                  {isWin ? "You Win" : "You Loose"}
                </Text>
                {soldPrice && (
                  <Text className={`${statusColor} text-sm font-bold`}>
                    - {soldPrice}
                  </Text>
                )}
              </View>
              <Text className="text-sm font-medium text-gray-500 ">
                Est: {estimate}
              </Text>
            </View>
            <TouchableOpacity
              // onPress={onViewDetails}
              className="p-2 mt-2 bg-gray-600 rounded"
            >
              <Text className="text-center text-white font-semibold">
                XEM CHI TIẾT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View></View>
      </View>
    </View>
  );
};

export default ItemBidCard;
