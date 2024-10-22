import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import moment from "moment-timezone";

interface ItemCurrentBidsProps {
  isLive: boolean;
  title: string;
  lotNumber: string;
  typeBid: string;
  minPrice: number;
  maxPrice: number;
  image: string;
  status: string;
  price: number;
  timeLeft: string;
  id: number;
  endTime: string;
  startTime: string;
}

type RootStackParamList = {
  DetailCurrentBid: {
    isLive: boolean;
    title: string;
    lotNumber: string;
    typeBid: string;
    minPrice: number;
    maxPrice: number;
    image: string;
    status: string;
    price: number;
    timeLeft: string;
    id: number;
    endTime: string;
    startTime: string;
  };
};

const ItemCurrentBids: React.FC<ItemCurrentBidsProps> = ({
  isLive,
  title,
  lotNumber,
  timeLeft,
  typeBid,
  image,
  status,
  minPrice,
  maxPrice,
  price,
  id,
  endTime,
  startTime,
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
        console.log("lotNumber", lotNumber);
      }}
      className="flex-row flex-1 gap-2 p-4 my-1 bg-white rounded-lg shadow-lg"
    >
      <View className="flex items-center w-[40%]">
        <View>
          <Image
            className="w-[160px] h-[200px] rounded-lg"
            source={{
              uri:
                image ||
                "https://st4.depositphotos.com/14953852/24787/v/380/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg",
            }}
          />
        </View>
        <View
          className={
            isLive
              ? "bg-[#98C583] p-2 w-[100%]"
              : " bg-yellow-600  p-2 w-[100%]"
          }
        >
          <Text className="text-lg font-bold text-center text-white">
            {isLive ? "Live Bidding" : "Coming Soon"}
          </Text>
          <Text className="text-sm font-bold text-center text-white">
            {timeLeft} left
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
        <Text className="text-xl font-bold mb-2">{title}</Text>
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
        {price !== 0 && (
          <View className="flex-row ">
            <Text className="text-gray-800 font-semibold text-base ">
              ${price}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ItemCurrentBids;
