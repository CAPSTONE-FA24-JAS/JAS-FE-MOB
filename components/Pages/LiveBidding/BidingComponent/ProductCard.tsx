import React from "react";
import { View, Text, Image } from "react-native";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  minPrice?: number;
  typeBid: string;
  maxPrice?: number;
  stepBidIncrement?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  minPrice,
  typeBid,
  maxPrice,
  stepBidIncrement,
}) => {
  return (
    <View className="px-4">
      <Image
        source={{ uri: image }}
        className="w-full h-64 rounded-md shadow-md"
        resizeMode="contain"
      />
      <View className="flex-row items-center justify-between p-2">
        <Text className="mt-2 text-lg font-bold">Lot {id}</Text>
        <View>
          <Text className="mr-2 text-sm font-medium text-gray-400 mt-">
            Est: {(minPrice ?? 0).toLocaleString()}$ -{" "}
            {(maxPrice ?? 0).toLocaleString()}$
          </Text>
          <Text className="mr-2 text-sm font-medium text-gray-400 mt-">
            Bid Increment Step:
            <Text className="text-blue-500">{stepBidIncrement}$</Text>
          </Text>
        </View>
      </View>
      <Text className="text-base font-semibold text-gray-700 ">{name}</Text>
      {typeBid === "Auction_Price_GraduallyReduced" && (
        <View className="w-full p-2 mt-2 bg-gray-100 rounded-md">
          <Text className="text-xl font-semibold text-center text-gray-800">
            Lot {id} - OPENING PRICE
          </Text>

          <View className="flex-row items-center justify-center gap-2 mt-2">
            <Text className="font-bold text-3xl text-[#EF0E25]">
              {(minPrice ?? 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProductCard;
