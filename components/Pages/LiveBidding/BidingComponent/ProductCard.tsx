import { LotDetail } from "@/app/types/lot_type";
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
  status?: string;
  item: LotDetail;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  minPrice,
  typeBid,
  maxPrice,
  stepBidIncrement,
  status,
  item,
}) => {
  return (
    <View className="p-2">
      <Image
        source={{ uri: image }}
        className="w-full h-64 p-2 rounded-md shadow-md"
        resizeMode="contain"
      />
      <View className="flex-row items-center justify-between p-2">
        <View className="flex-1 gap-2">
          <Text className="mt-2 text-lg font-bold">Lot: #{id}</Text>
          <Text className="text-base font-semibold text-gray-700">{name}</Text>
          <Text className="text-sm font-medium text-gray-400">
            Type:{" "}
            {typeBid === "Public_Auction"
              ? "Public Auction"
              : "Reverse Auction"}
          </Text>

          <View>
            <Text className="mr-2 text-sm font-medium text-gray-400 mt-">
              Est:{" "}
              {(item.jewelry.estimatePriceMin ?? 0).toLocaleString("vi-vn", {
                style: "currency",
                currency: "VND",
              })}{" "}
              -{" "}
              {(item.jewelry.estimatePriceMax ?? 0).toLocaleString("vi-vn", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-400">
                Bid {typeBid === "Public_Auction" ? "increment" : "decrement"}{" "}
                step:{" "}
                <Text className="text-blue-500">
                  {(stepBidIncrement ?? 0).toLocaleString("vi-vn", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              </Text>
              <Text className="text-lg font-medium text-gray-400">
                Status: <Text className="text-blue-500">{status}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
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
