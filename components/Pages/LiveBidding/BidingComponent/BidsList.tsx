import { LotDetail } from "@/app/types/lot_type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { View, Text } from "react-native";

interface Bid {
  time: string;
  amount: number;
  customerId: number | string;
}

interface BidsListProps {
  item: LotDetail;
  bids: Bid[];
  currentCusId?: number; // Add this prop to identify current user's bids
  reducePrice?: number;
}

const BidsList: React.FC<BidsListProps> = ({
  item,
  bids,
  currentCusId,
  reducePrice,
}) => {
  // Sort bids by time, newest first
  const sortedBids = useMemo(() => {
    return [...bids].sort((a, b) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      return timeB - timeA;
    });
  }, [bids]);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
  };

  console.log("lottypesss", item.lotType);
  console.log("bids reduce", reducePrice);

  if (item.lotType === "Public_Auction") {
    return (
      <View className="p-4 ">
        {sortedBids.map((bid, index) => {
          const isCurrentUserBid = bid.customerId === currentCusId;

          return (
            <View key={index}>
              <View
                className={`flex-row justify-between rounded-md p-3 ${
                  isCurrentUserBid
                    ? "bg-blue-100 border border-blue-300"
                    : "bg-white border-gray-300 border"
                }`}>
                <View>
                  <Text className="text-gray-600">{formatTime(bid.time)}</Text>
                  {isCurrentUserBid && (
                    <Text className="text-xs text-blue-600">Your bid</Text>
                  )}
                </View>

                <Text
                  className={`font-bold ${
                    isCurrentUserBid ? "text-blue-700" : "text-gray-700"
                  }`}>
                  ${bid.amount.toLocaleString()}
                </Text>
              </View>

              {index < sortedBids.length - 1 && (
                <View className="h-[1px] bg-gray-200 my-2" />
              )}
            </View>
          );
        })}
      </View>
    );
  }

  if (item.lotType === "Auction_Price_GraduallyReduced") {
    const percentReduce =
      item.startPrice && reducePrice
        ? (((item.startPrice - reducePrice) / item.startPrice) * 100).toFixed(2)
        : 0;
    return (
      <View className="p-4">
        <View className="flex-row items-center justify-around p-3 py-6 bg-white border border-gray-300 rounded-md">
          <Text className="text-lg">Current Price:</Text>
          <Text className="text-xl text-gray-600">{reducePrice}</Text>
          <View className="flex items-center">
            <Text className="text-lg text-center text-red-700 ">
              {percentReduce}%
            </Text>
            <MaterialCommunityIcons
              name="arrow-down-bold"
              size={32}
              color="#dc2626"
            />
          </View>
        </View>
      </View>
    );
  }

  return null;
};

export default BidsList;
