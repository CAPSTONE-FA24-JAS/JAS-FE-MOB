import moment from "moment-timezone";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface ItemBidCardProps {
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
  statusColor: string;
}

const ItemBidCard: React.FC<ItemBidCardProps> = ({
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
  statusColor,
}) => {
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
    <View className="p-4  bg-white my-2 mx-4 rounded-lg shadow">
      <View className="flex-row ">
        {image ? (
          <Image source={{ uri: image }} className="w-24 h-full mr-4 rounded" />
        ) : (
          <Image
            source={require("../../../../assets/item-jas/item1.jpg")}
            className="w-24 h-24 mr-4 rounded"
          />
        )}

        <View className="flex-1">
          <View className="flex flex-row items-center justify-between  ">
            <Text className=" text-sm  text-[#8f8f8f] ">
              {moment(startTime).format(" DD/MM/YYYY")} -{" "}
              {moment(endTime).format(" DD/MM/YYYY")}
            </Text>
            {/* <Text className="text-xs text-gray-600 ">12:00, 20/12/2024</Text> */}
            <Text className="text-gray-600">{lotNumber}</Text>
          </View>
          <Text className="text-lg font-semibold ">{title}</Text>
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
          </View>
          <View className="justify-between mt-4  flex-row">
            <Text
              className="text-base text-center font-semibold  uppercase"
              style={{ color: getStatusColor(status) }}
            >
              {formatStatus(status)}
            </Text>
            <TouchableOpacity
              // onPress={onViewDetails}
              className="px-3  py-1 bg-gray-600 rounded"
            >
              <Text className="text-center text-white font-semibold">
                XEM CHI TIẾT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemBidCard;
