import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text } from "react-native";

interface Bid {
  time: string;
  user: string;
  amount: number;
  highlight: boolean;
}

interface BidsListProps {
  bids: Bid[];
  item: {
    id: number;
    name: string;
    minPrice?: number;
    maxPrice?: number;
    price?: number;
    image: string;
    typeBid: number;
  };
}

const BidsList: React.FC<BidsListProps> = ({ bids, item }) => {
  // Conditionally render UI based on typeBid
  if (item.typeBid === 3) {
    // Render the default list of bids
    return (
      <View className="p-4">
        {bids.map((bid, index) => (
          <View key={index}>
            <View
              className={`flex-row justify-between rounded-md p-3 ${
                bid.highlight ? "bg-red-200" : "bg-white"
              }`}
            >
              <Text>{bid.time}</Text>
              <Text className="font-bold uppercase ">{bid.user}</Text>
              <Text className="font-bold">${bid.amount}</Text>
            </View>

            {/* Horizontal line (except for the last item) */}
            {index < bids.length - 1 && (
              <View className="h-[1px] bg-gray-300 my-2" />
            )}
          </View>
        ))}
      </View>
    );
  }

  if (item.typeBid === 4) {
    // Render the custom layout for typeBid 4
    const firstBid = bids[0]; // Assuming the first bid is the winner

    return (
      <View className="p-4">
        <View className="border border-gray-300 rounded-md flex-row justify-between p-4 bg-red-100">
          <View className="">
            <Text className="text-gray-500">{firstBid.time}</Text>
            <Text className="text-lg font-bold">{firstBid.user}</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="arrow-down-bold-box-outline"
              size={24}
              color="#EF0E25"
            />
            <Text className="text-[#EF0E25] mr-2 text-lg font-semibold">
              {" "}
              ${firstBid.amount}
            </Text>
            <Text className="font-medium text-sm text-[#EF0E25]">(-10%)</Text>
          </View>
        </View>
        <Text className="text-green-500 mt-2 text-center text-sm">
          Congratulation! {firstBid.user} had bid successfully!
        </Text>
      </View>
    );
  }

  return null; // Fallback, if no matching typeBid
};

export default BidsList;
