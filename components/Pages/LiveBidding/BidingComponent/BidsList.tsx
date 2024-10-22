import { LotDetail } from "@/app/types/lot_type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface Bid {
  time: string;
  amount: number;
  AccountId: number;
}

interface BidsListProps {
  item: LotDetail;
  bids: Bid[];
  currentUserId?: number; // Add this prop to identify current user's bids
}

const BidsList: React.FC<BidsListProps> = ({ item, bids, currentUserId }) => {
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

  if (item.lotType === "Public_Auction") {
    return (
      <View className="p-4 ">
        {sortedBids.map((bid, index) => {
          const isCurrentUserBid = bid.AccountId === currentUserId;

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

  if (item.lotType === "Secret_Auction") {
    const firstBid = sortedBids[0];
    const isWinnerCurrentUser = firstBid?.AccountId === currentUserId;

    return (
      <View className="p-4">
        <View
          className={`flex-row justify-between p-4 rounded-md border ${
            isWinnerCurrentUser
              ? "bg-blue-100 border-blue-300"
              : "bg-red-100 border-gray-300"
          }`}>
          <View>
            <Text className="text-gray-500">{formatTime(firstBid?.time)}</Text>
            <Text className="text-lg font-bold">{firstBid?.AccountId}</Text>
            {isWinnerCurrentUser && (
              <Text className="text-xs text-blue-600">Your winning bid</Text>
            )}
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="arrow-down-bold-box-outline"
              size={24}
              color={isWinnerCurrentUser ? "#3B82F6" : "#EF0E25"}
            />
            <Text
              className={`mr-2 text-lg font-semibold ${
                isWinnerCurrentUser ? "text-blue-600" : "text-[#EF0E25]"
              }`}>
              ${firstBid?.amount.toLocaleString()}
            </Text>
            <Text
              className={`font-medium text-sm ${
                isWinnerCurrentUser ? "text-blue-600" : "text-[#EF0E25]"
              }`}>
              (-10%)
            </Text>
          </View>
        </View>
        <Text
          className={`mt-2 text-sm text-center ${
            isWinnerCurrentUser ? "text-blue-500" : "text-green-500"
          }`}>
          {isWinnerCurrentUser
            ? "Congratulations! You won the auction!"
            : `Congratulations! ${firstBid?.AccountId} won the auction!`}
        </Text>
      </View>
    );
  }

  return null;
};

export default BidsList;
