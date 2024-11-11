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
}

const BidInputMethod4: React.FC<BidInputProps> = ({
  isEndAuctionMethod4,
  item,
  onPlaceBidMethod4,
  reducePrice,
  resultBidding,
  setResultBidding,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loadingMethod4, setLoadingMethod4] = useState<boolean>(false);

  const isFinancialProof = item.haveFinancialProof;
  const priceLimitofCustomer = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.priceLimit
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

    // Hiển thị alert để xác nhận
    Alert.alert(
      "Xác nhận đặt giá",
      `Bạn có chắc chắn muốn đặt giá ${price.toLocaleString()} cho món này không?`,
      [
        {
          text: "Hủy",
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

  return (
    <View className="w-full p-3">
      <View className="flex items-center justify-between">
        <TouchableOpacity
          disabled={
            isEndAuctionMethod4 ||
            item.status === "Sold" ||
            loadingMethod4 ||
            item.status === "Passed"
          }
          onPress={() => handleSubmitBidMethod4(reducePrice ?? 0)}
          className={
            isEndAuctionMethod4 ||
            item.status === "Sold" ||
            item.status === "Passed" ||
            loadingMethod4
              ? "w-[50%] flex items-center justify-center h-12 bg-gray-500 rounded-md"
              : "w-[50%] flex items-center justify-center h-12 bg-blue-500 rounded-md"
          }>
          <Text className="text-xl font-semibold text-white">
            {isEndAuctionMethod4 ||
            item.status === "Sold" ||
            item.status === "Passed"
              ? "SOLD"
              : "BUY NOW"}
          </Text>
          {error && (
            <Text className="mt-2 text-center text-red-500">{error}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BidInputMethod4;
