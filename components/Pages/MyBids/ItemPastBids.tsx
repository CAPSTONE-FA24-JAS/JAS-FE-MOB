import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import moment from "moment-timezone";

interface ItemPastBidsProps {
  isWin: boolean;
  title: string;
  lotNumber: string;
  soldPrice: string;
  id: number;
  status: string;
  typeBid: string;
  minPrice: number;
  maxPrice: number;
  image: string;
  endTime: string;
  startTime: string;
  yourMaxBid: number;
}

type RootStackParamList = {
  DetailMyBid: {
    isWin: boolean;
    title: string;
    lotNumber: string;
    soldPrice: string;
    id: number;
    status: string;
    typeBid: string;
    minPrice: number;
    maxPrice: number;
    image: string;
    endTime: string;
    startTime: string;
    yourMaxBid: number;
  };
};

const ItemPastBids: React.FC<ItemPastBidsProps> = ({
  isWin,
  title,
  lotNumber,
  soldPrice,
  id,
  status,
  typeBid,
  minPrice,
  maxPrice,
  image,
  endTime,
  startTime,
  yourMaxBid,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "#FFA500";
      case "Auctionning":
        return "#7EBF9C";
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

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("DetailMyBid", {
          isWin,
          title,
          lotNumber,
          soldPrice,
          id,
          status,
          typeBid,
          minPrice,
          maxPrice,
          image,
          endTime,
          startTime,
          yourMaxBid,
        });
      }}
      className="flex-row flex-1 gap-2 p-4 my-1 bg-white rounded-lg shadow-lg"
    >
      <View className="flex items-center w-[40%]">
        <Image
          className="w-[160px] h-[200px] rounded-lg"
          source={{
            uri:
              image ||
              "https://st4.depositphotos.com/14953852/24787/v/380/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg",
          }}
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
        <TouchableOpacity
          className={` rounded px-4 py-1 justify-center mr-4 flex-row items-center`}
          style={{ backgroundColor: getStatusColor(status) }}
        >
          <Text className="text-base text-center font-semibold text-white uppercase">
            {formatStatus(status)}
          </Text>
        </TouchableOpacity>
        <Text className=" text-sm  text-[#8f8f8f] ">
          {moment(startTime).format(" DD/MM/YYYY")} -
          {moment(endTime).format(" DD/MM/YYYY")}
        </Text>
        <Text className="text-base font-semibold text-gray-600">
          {lotNumber}
        </Text>
        <Text className="text-xl font-bold">{title}</Text>
        <View className="flex-row  w-[60%]">
          <Text className="text-base font-bold text-[#6c6c6c] ">Type: </Text>
          <Text className="text-[#6c6c6c] text-base ">
            {formatTypeBid(typeBid)}
          </Text>
        </View>
        {minPrice !== 0 && maxPrice !== 0 && (
          <View className="">
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
        <Text className="text-base text-gray-600">
          SOLD: <Text className="font-semibold">{soldPrice}</Text>
        </Text>
        <Text className="text-base text-gray-600">
          Your max bid: <Text className="font-semibold">{yourMaxBid}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemPastBids;
