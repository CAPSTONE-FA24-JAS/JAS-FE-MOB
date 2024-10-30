import { ImageJewelry } from "@/app/types/lot_type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  minPrice?: number;
  typeBid: string;
  maxPrice?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  minPrice,
  typeBid,
  maxPrice,
}) => {
  return (
    <View className="px-4">
      <Image
        source={{ uri: image }}
        className="w-full h-64 rounded-md shadow-md"
        resizeMode="contain"
      />
      <View className="flex-row items-center justify-between">
        <Text className="mt-2 text-lg font-bold">Lot {id}</Text>
        {typeBid === "Public_Auction" ? (
          <Text className="mr-2 text-sm font-medium text-gray-400 mt-">
            Start Price:{" "}
            {(minPrice ?? 0).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        ) : (
          <Text className="mr-2 text-lg font-medium text-gray-700 mt-">
            Original Price: $
            {(maxPrice ?? 0).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        )}
      </View>
      <Text className="text-base font-semibold text-gray-700 ">{name}</Text>
      {typeBid === "Auction_Price_GraduallyReduced" && (
        <View className="w-full p-2 mt-2 bg-gray-100 rounded-md">
          <Text className="text-xl font-semibold text-center text-gray-800">
            Lot {id} - Current Bid
          </Text>

          <View className="flex-row items-center justify-center gap-2 mt-2">
            <MaterialCommunityIcons
              name="arrow-down-bold-box-outline"
              size={35}
              color="#EF0E25"
            />
            <Text className="font-bold text-3xl text-[#EF0E25]">
              {(minPrice ?? 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
            <Text className="font-medium text-lg text-[#EF0E25]">(-20%)</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProductCard;
