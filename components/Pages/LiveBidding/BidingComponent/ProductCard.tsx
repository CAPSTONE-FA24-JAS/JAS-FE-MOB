import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  minPrice?: number;
  typeBid: number;
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
        <Text className="text-lg font-bold mt-2">Lot {id}</Text>
        {typeBid === 3 ? (
          <Text className="text-sm text-gray-400 font-medium mt- mr-2">
            Start Price: ${minPrice}
          </Text>
        ) : (
          <Text className="text-lg text-gray-700 font-medium mt- mr-2">
            Original Price: ${maxPrice}
          </Text>
        )}
      </View>
      <Text className="text-gray-700 font-semibold text-base ">{name}</Text>
      {typeBid === 4 && (
        <View className="w-full p-2 bg-gray-100 mt-2 rounded-md">
          <Text className="text-xl font-semibold text-center text-gray-800">
            Lot {id} - Current Bid
          </Text>

          <View className="flex-row justify-center gap-2 items-center  mt-2">
            <MaterialCommunityIcons
              name="arrow-down-bold-box-outline"
              size={35}
              color="#EF0E25"
            />
            <Text className="font-bold text-3xl text-[#EF0E25]">
              ${minPrice}
            </Text>
            <Text className="font-medium text-lg text-[#EF0E25]">(-20%)</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProductCard;
