import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

type RootStackParamList = {
  LotDetailScreen: {
    id: string;
    name: string;
    minPrice?: number;
    maxPrice?: number;
    price?: number;
    image: string;
    typeBid: number;
  };
};

interface ItemLotsProps {
  id: string;
  name: string;
  minPrice?: number;
  maxPrice?: number;
  price?: number;
  image: any;
  typeBid: number;
}

const ItemLots: React.FC<ItemLotsProps> = ({
  id,
  name,
  minPrice,
  maxPrice,
  price,
  image,
  typeBid,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const router = useRouter();
  const goToAuctionDetail = () => {
    navigation.navigate("LotDetailScreen", {
      id,
      name,
      minPrice,
      maxPrice,
      price,
      image,
      typeBid,
    });
  };
  return (
    <TouchableOpacity className="w-[47%] mb-5" onPress={goToAuctionDetail}>
      <View className="flex-1 p-1 bg-[#FAFAFA]">
        <Image
          className="w-[100%] h-[200px] rounded-sm"
          source={{ uri: image }}
        />
        <View className="flex gap-2">
          <Text className=" text-base font-bold text-[#8f8f8f] ">
            Lot #{id}
          </Text>
          <Text className=" text-lg font-bold text-black ">{name}</Text>
          {minPrice && maxPrice && (
            <View className="ml-4">
              <Text className=" text-base text-[#6c6c6c] ">
                Est: ${minPrice} - ${maxPrice}
              </Text>
              <View className="flex-row gap-2 ">
                <Text className="text-base font-bold text-[#6c6c6c] ">
                  Start Bid:
                </Text>
                <Text className="text-[#6c6c6c] text-base ">${minPrice}</Text>
              </View>
            </View>
          )}

          {price && (
            <View className="flex-row ">
              <Text className="text-base font-bold text-[#6c6c6c] ">
                Price:
              </Text>
              <Text className="text-[#6c6c6c] text-base ">${price}</Text>
            </View>
          )}
          {/* Show the typeBid */}
          <View className="flex-row ">
            <Text className="text-base font-bold text-[#6c6c6c] ">
              Type Bid:{" "}
            </Text>
            <Text className="text-[#6c6c6c] text-base ">
              Hình thức {typeBid}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemLots;
