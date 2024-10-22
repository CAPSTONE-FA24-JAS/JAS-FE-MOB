import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRouter } from "expo-router";
import moment from "moment-timezone";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

type RootStackParamList = {
  LotDetailScreen: {
    id: number;
    name: string;
    minPrice?: number;
    maxPrice?: number;
    price?: number;
    image: string;
    typeBid: string;
    status: string;
    startTime?: string;
    endTime?: string;
  };
};

interface ItemLotsProps {
  id: number;
  name: string;
  minPrice?: number;
  maxPrice?: number;
  price?: number;
  image: string;
  typeBid: string;
  status: string;
  startTime?: string;
  endTime?: string;
}

const ItemLots: React.FC<ItemLotsProps> = ({
  id,
  name,
  minPrice,
  maxPrice,
  price,
  image,
  typeBid,
  status,
  startTime,
  endTime,
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
      status,
      startTime,
      endTime,
    });
  };
  const formatTypeBid = (typeBid: string) => {
    switch (typeBid) {
      case "Fixed_Price":
        return "Fixed Price";
      case "Secret_Auction":
        return "Secret Auction";
      case "Public_Auction":
        return "Public Auction";
      case "Auction_Price_GraduallyReduced":
        return "Gradually Reduced Price";
      default:
        return typeBid;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "#7EBF9C";
      case "Auctionning":
        return "#FFA500";
      case "Sold":
        return "#4CAF50";
      case "Canceled":
        return "#FF0000";
      case "Pausing":
        return "#FFD700";
      default:
        return "#666666";
    }
  };
  const formatStatus = (status: string) => {
    switch (status) {
      case "Ready": // sai chính tả
        return "New Lot ready";
      case "Auctionning":
        return "Auctionning";
      case "Sold":
        return "Sold";
      case "Canceled":
        return "Canceled";
      case "Pausing":
        return "Paused";
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity
      className="w-[47%] border-gray-100 border-2 rounded-lg mb-5 relative"
      onPress={goToAuctionDetail}
    >
      {/* Tag status ở góc phải */}
      <TouchableOpacity
        className={`absolute top-2 z-10 right-2 rounded px-4 py-1 flex-row items-center`}
        style={{ backgroundColor: getStatusColor(status) }}
      >
        <Text className="text-base font-semibold text-white uppercase">
          {formatStatus(status)}
        </Text>
      </TouchableOpacity>

      <View className="flex-1 p-1 bg-[#FAFAFA]">
        <Image
          className="w-[100%] h-[200px] rounded-sm"
          source={{ uri: image }}
        />
        <View className="flex gap-0 mt-2 mx-2">
          <Text className=" text-sm  text-[#8f8f8f] ">
            {moment(startTime).format(" DD/MM/YYYY")} -{" "}
            {moment(endTime).format(" DD/MM/YYYY")}
          </Text>
          <Text className=" text-base font-bold text-[#8f8f8f] ">
            Lot #{id}
          </Text>
          <Text
            className=" text-base font-bold text-black "
            numberOfLines={2} // Số dòng tối đa
            ellipsizeMode="tail"
          >
            {name}
          </Text>
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
              <Text className="text-gray-800 font-semibold text-base ">
                ${price}
              </Text>
            </View>
          )}
          {/* Show the typeBid */}
          <View className="flex-row  w-[60%]">
            <Text className="text-base font-bold text-[#6c6c6c] ">Type: </Text>
            <Text className="text-[#6c6c6c] text-base ">
              {formatTypeBid(typeBid)}
            </Text>
          </View>
          {/* <Text className="text-gray-700 text-base uppercase">{status}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemLots;
