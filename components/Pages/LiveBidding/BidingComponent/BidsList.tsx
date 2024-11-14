import { LotDetail } from "@/app/types/lot_type";
import { Message } from "@/hooks/useBiddingMethod3";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { View, Text } from "react-native";

interface BidsListProps {
  item: LotDetail;
  bids?: Message[];
  currentCusId: number;
  reducePrice?: number;
}

const BidsList: React.FC<BidsListProps> = ({
  item,
  bids,
  currentCusId,
  reducePrice,
}) => {
  // Memoized sorted bids

  // Helper to format time
  const formatTime = (timeString: string) => {
    // Tách phần milliseconds từ chuỗi thời gian
    const [datePart, millisecondsPart] = timeString.split(".");
    const milliseconds = millisecondsPart
      ? millisecondsPart.slice(0, 3)
      : "000";

    // Tạo đối tượng Date từ phần ngày giờ
    const date = new Date(datePart + "Z");

    // Định dạng chuỗi thời gian
    const formattedDate = date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });

    // Ghép thêm phần milliseconds
    return `${formattedDate}.${milliseconds}`;
  };

  if (item.lotType === "Public_Auction" && bids) {
    if (!bids || !Array.isArray(bids)) {
      return (
        <View className="p-4">
          <Text>No bids available</Text>
        </View>
      );
    }
    const sortedBids = useMemo(() => {
      console.log("Raw bids:", bids);

      const filteredBids = bids.filter((bid) =>
        ["Processing", "Failed"].includes(bid.status)
          ? bid.customerId.toString().trim() === currentCusId.toString().trim()
          : true
      );

      console.log("Filtered bids:", filteredBids);

      return filteredBids.sort(
        (a, b) => new Date(b.bidTime).getTime() - new Date(a.bidTime).getTime()
      );
    }, [bids, currentCusId]);
    return (
      <View className="p-4">
        {sortedBids.length > 0 ? (
          sortedBids.map((bid, index) => (
            <MemoizedItem
              key={`${bid.customerId}-${bid.bidTime}-${index}`}
              bid={bid}
              currentCusId={currentCusId}
              formatTime={formatTime}
              showDivider={index < sortedBids.length - 1}
            />
          ))
        ) : (
          <Text className="items-center text-center">No bids yet</Text>
        )}
      </View>
    );
  }

  console.log("type", item.lotType);

  if (item.lotType.trim() === "Auction_Price_GraduallyReduced") {
    const percentReduce =
      item.startPrice && reducePrice
        ? (((item.startPrice - reducePrice) / item.startPrice) * 100).toFixed(2)
        : "0";
    return (
      <View className="p-4">
        <View className="flex-row items-center justify-around p-3 py-6 bg-white border border-gray-300 rounded-md">
          <Text className="text-lg">Current Price:</Text>
          <Text className="text-xl text-gray-600">${reducePrice}</Text>
          <View className="flex items-center">
            <Text className="text-lg text-center text-red-700">
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

  return <Text>abnbbbbbbbbbbbbbbbb</Text>;
};

export default BidsList;

// Memoized Item Component
interface MemoizedItemProps {
  bid: Message;
  currentCusId: number;
  formatTime: (timeString: string) => string;
  showDivider: boolean;
}

const MemoizedItem: React.FC<MemoizedItemProps> = React.memo(
  ({ bid, currentCusId, formatTime, showDivider }) => {
    const isCurrentUserBid =
      bid.customerId.toString() === currentCusId.toString();

    // Status color helpers
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "processing":
          return "text-yellow-600";
        case "failed":
          return "text-red-600";
        case "success":
          return "text-blue-600";
        default:
          return "text-gray-600";
      }
    };

    const getStatusBgColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "processing":
          return "bg-yellow-100 border-yellow-300";
        case "failed":
          return "bg-red-100 border-red-300";
        case "success":
          return "bg-blue-100 border-blue-300";
        default:
          return "bg-white border-gray-300";
      }
    };

    return (
      <View>
        <View
          className={`flex-row justify-between rounded-md p-3 ${
            isCurrentUserBid
              ? getStatusBgColor(bid.status)
              : "bg-white border-gray-300 border"
          }`}>
          <View>
            <Text className="text-gray-600">{formatTime(bid.bidTime)}</Text>
            {isCurrentUserBid && (
              <Text className={`text-xs ${getStatusColor(bid.status)}`}>
                Your bid • Status: {bid.status}
              </Text>
            )}
          </View>
          <Text
            className={`font-bold ${
              isCurrentUserBid ? getStatusColor(bid.status) : "text-gray-700"
            }`}>
            ${bid.currentPrice}
          </Text>
        </View>
        {showDivider && <View className="h-[1px] bg-gray-200 my-2" />}
      </View>
    );
  }
);
