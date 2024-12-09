import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ToastAndroid,
} from "react-native";
import { LotDetail } from "@/app/types/lot_type";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface BidInputProps {
  isEndAuctionMethod4: boolean;
  item: LotDetail;
  onPlaceBidMethod4: (price: number) => Promise<void>;
  reducePrice?: number;
  resultBidding?: string;
  setResultBidding: React.Dispatch<React.SetStateAction<string>>;
  status: string;
  isPlaceBidCus: boolean;
  isLoading: boolean;
}

const BidInputMethod4: React.FC<BidInputProps> = ({
  isEndAuctionMethod4,
  item,
  onPlaceBidMethod4,
  reducePrice,
  resultBidding,
  setResultBidding,
  status,
  isPlaceBidCus,
  isLoading,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loadingMethod4, setLoadingMethod4] = useState<boolean>(false);

  const isFinancialProof = item.haveFinancialProof;
  const priceLimitofCustomer = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.priceLimit
  );

  useEffect(() => {
    if (resultBidding && resultBidding !== "") {
      ToastAndroid.showWithGravity(
        resultBidding,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
      setResultBidding("");
    }
  }, [resultBidding]);

  const handleSubmitBidMethod4 = async (price: number) => {
    console.log("Method 4", price);
    if (isFinancialProof) {
      if (price > priceLimitofCustomer) {
        setError(
          `Bid must be lower than your price limit (${priceLimitofCustomer?.toLocaleString()})`
        );
        return;
      }
    }

    Alert.alert(
      "Confirm Bid",
      `Are you sure you want to place a bid of ${price.toLocaleString()} for this item?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            setLoadingMethod4(true);
            setError(null);
            await onPlaceBidMethod4(price);
            ToastAndroid.showWithGravity(
              `Bidding successfully with ${price.toLocaleString()}`,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM
            );
          },
        },
      ]
    );
  };

  const getButtonText = () => {
    if (isEndAuctionMethod4 || item.status === "Sold") {
      return "SOLD";
    }
    if (item.status === "Passed") {
      return "PASSED";
    }
    if (status === "Pause") {
      return "PAUSED";
    }
    if (status === "Cancelled") {
      return "CANCELLED";
    }
    if (isPlaceBidCus) {
      return "YOU HAVE PLACED A BID";
    }
    if (loadingMethod4) {
      return "PROCESSING...";
    }
    return "BUY NOW";
  };

  const isDisabled =
    isEndAuctionMethod4 ||
    item.status === "Sold" ||
    loadingMethod4 ||
    item.status === "Passed" ||
    status === "Pause" ||
    status === "Canceled" ||
    isPlaceBidCus;

  return (
    <View className="w-full p-3">
      <View className="flex items-center justify-between">
        <TouchableOpacity
          disabled={isDisabled}
          onPress={() => handleSubmitBidMethod4(reducePrice ?? 0)}
          className={
            isDisabled
              ? "w-[50%] flex items-center justify-center h-12 bg-gray-500 rounded-md"
              : "w-[50%] flex items-center justify-center h-12 bg-blue-500 rounded-md"
          }>
          <Text className="text-xl font-semibold text-white">
            {getButtonText()}
          </Text>
        </TouchableOpacity>
        {error && (
          <Text className="mt-2 text-center text-red-500">{error}</Text>
        )}
      </View>
    </View>
  );
};

export default BidInputMethod4;
