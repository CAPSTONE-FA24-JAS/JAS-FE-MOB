import { buyNowMethod3 } from "@/api/bidApi";
import { LotDetail } from "@/app/types/lot_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { Message } from "@/hooks/useBiddingMethod3";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import PriceTimeline from "./PriceTimeline";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface BidsListProps {
  item: LotDetail;
  bids?: Message[];
  currentCusId: number;
  reducePrice?: number;
  isEndAuctionMethod3?: boolean;
  isEndLot?: boolean;
  status?: string;
  milenstoneReduceTime?: string;
  amountCustomerBid?: string;
}

const BidsList: React.FC<BidsListProps> = ({
  item,
  bids,
  currentCusId,
  reducePrice,
  isEndAuctionMethod3,
  isEndLot,
  status,
  milenstoneReduceTime,
  amountCustomerBid,
}) => {
  // Memoized sorted bids

  const bidLitmit = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.priceLimit
  );

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

  const handleBuyNow = async () => {
    Alert.alert(
      "Confirm Purchase",
      `Are you sure you want to purchase this item for ${item.finalPriceSold.toLocaleString(
        "vi-VN",
        {
          style: "currency",
          currency: "VND",
        }
      )}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",

          onPress: async () => {
            if (item.haveFinancialProof && item.finalPriceSold > bidLitmit) {
              showErrorMessage("You have reached the limit price");
              return;
            }
            const response = await buyNowMethod3(currentCusId, item.id);
            if (response) {
              showSuccessMessage("Item purchased successfully!");
            } else {
              showErrorMessage("Failed to purchase item.");
            }
          },
        },
      ]
    );
  };

  const buyNow = () => {
    const isDisabled =
      isEndAuctionMethod3 ||
      isEndLot ||
      item.status === "Sold" ||
      item.status === "Passed" ||
      status === "Pause" ||
      status === "Cancel";

    return (
      <View className="mb-4">
        <View className="p-4 bg-white border border-gray-300 rounded-md">
          <Text className="mb-2 text-lg font-semibold text-center">
            Buy Now Price
          </Text>
          <Text className="mb-2 text-2xl font-bold text-center text-red-600">
            {(item.finalPriceSold ? item.finalPriceSold : 0).toLocaleString(
              "vi-VN",
              {
                style: "currency",
                currency: "VND",
              }
            )}
          </Text>
          <TouchableOpacity
            className={`px-4 py-3 rounded-md ${
              isDisabled ? "bg-gray-400" : "bg-red-600"
            }`}
            onPress={!isDisabled ? handleBuyNow : undefined}
            disabled={isDisabled}>
            <Text className="font-semibold text-center text-white">
              {isDisabled ? "AUCTION ENDED" : "BUY NOW"}
            </Text>
          </TouchableOpacity>
          <Text className="mt-2 text-xs text-center text-gray-500">
            Skip the bidding - purchase immediately at a price
          </Text>
        </View>
      </View>
    );
  };

  if (item.lotType === "Public_Auction" && bids) {
    if (!bids || !Array.isArray(bids)) {
      return (
        <View className="p-4">
          <Text>No bids available</Text>
          {item.finalPriceSold && buyNow()}
        </View>
      );
    }
    const sortedBids = useMemo(() => {
      const filteredBids = bids.filter((bid) =>
        ["Processing", "Failed"].includes(bid.status)
          ? bid.customerId.toString().trim() === currentCusId.toString().trim()
          : true
      );

      return filteredBids.sort((a, b) => {
        const timeDiff =
          new Date(b.bidTime).getTime() - new Date(a.bidTime).getTime();
        if (timeDiff === 0) {
          // Nếu thời gian bằng nhau, sắp xếp theo giá
          return b.currentPrice - a.currentPrice;
        }
        return timeDiff; // Sắp xếp theo thời gian
      });
    }, [bids, currentCusId]);
    return (
      <View className="p-4">
        {item.finalPriceSold && buyNow()}
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
        <PriceTimeline
          startPrice={item.startPrice || 0}
          currentPrice={reducePrice || 0}
          bidIncrement={item.bidIncrement || 0}
          bidIncrementTime={60} // Set this to your desired interval in seconds
          startTime={item.startTime}
          milenstoneReduceTime={milenstoneReduceTime} // Add this prop
          status={status || item.status}
          finalPriceSold={item.finalPriceSold || 0}
        />
        <View className="flex-row items-center justify-between pt-4 border-t border-gray-200">
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="account-group"
              size={24}
              color="#4B5563"
              className="mr-2"
            />
            <Text className="text-base text-gray-600">Participants:</Text>
          </View>
          <Text className="text-lg font-semibold text-blue-600">
            {amountCustomerBid || 0} people
          </Text>
        </View>
        <View className="flex-row items-center justify-around p-3 py-4 bg-white border border-gray-300 rounded-md">
          <Text className="text-lg">Current Price:</Text>
          <Text className="text-xl text-gray-600">
            {(reducePrice ?? 0).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
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

  return <Text>Loading...</Text>;
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
            {(bid.currentPrice ?? 0).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </View>
        {showDivider && <View className="h-[1px] bg-gray-200 my-2" />}
      </View>
    );
  }
);
