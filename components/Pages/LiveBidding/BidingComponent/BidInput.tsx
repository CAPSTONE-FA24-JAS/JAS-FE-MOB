import { LotDetail } from "@/app/types/lot_type";
import { Message } from "@/hooks/useBiddingMethod3";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

interface BidInputProps {
  highestBid: number;
  item: LotDetail;
  onPlaceBid: (price: number) => Promise<void>;
  isEndAuctionMethod3: boolean;
  resultBidding?: string;
  setResultBidding: React.Dispatch<React.SetStateAction<string>>;
  isEndLot: boolean; //just for method 3
  bids: Message[];
  status: string;
}

const BidInput: React.FC<BidInputProps> = ({
  highestBid,
  item,
  onPlaceBid,
  isEndAuctionMethod3,
  resultBidding,
  setResultBidding,
  isEndLot, //just for method 3
  bids,
  status,
}) => {
  const [bidValue, setBidValue] = useState<number>(() =>
    highestBid !== 0
      ? highestBid + (item.bidIncrement ?? 100)
      : (item.startPrice ?? 0) + (item.bidIncrement ?? 0)
  );
  const [stepBidIncrement, setStepBidIncrement] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const priceLimit = useSelector(
    (store: RootState) => store.auth.userResponse?.customerDTO?.priceLimit
  );

  const isFinancialProof = item.haveFinancialProof;
  const priceLimitofCustomer = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.priceLimit
  );

  const cusid = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.id
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

  const validateBidMethod3 = (value: number) => {
    if (isFinancialProof && value > priceLimitofCustomer) {
      return `Bid must be lower than your price limit (${priceLimitofCustomer?.toLocaleString()})`;
    }
    if (value === 0) {
      return "Bid must be higher than 0";
    }
    if (value <= highestBid) {
      return `Bid must be higher than ${highestBid.toLocaleString()}`;
    }
    if (value > priceLimit) {
      return `Bid must be lower than your price limit (${priceLimit?.toLocaleString()})`;
    }
    return null;
  };

  const handleBidChangeMethod3 = (newValue: string) => {
    const numericValue = parseInt(newValue.replace(/,/g, ""), 10) || 0;
    setStepBidIncrement(() => numericValue);
    let bidValueCurr = highestBid;

    if (item.bidIncrement) {
      // Tính giá trị bid mới
      const calculatedBid = numericValue * item.bidIncrement + highestBid;

      // Nếu có finalPriceSold và giá tính được vượt quá finalPriceSold
      if (item.finalPriceSold && calculatedBid >= item.finalPriceSold) {
        bidValueCurr = item.finalPriceSold;
        // Optional: Cập nhật lại step để phù hợp với finalPriceSold
        const correctedStep = Math.floor(
          (item.finalPriceSold - highestBid) / item.bidIncrement
        );
        setStepBidIncrement(correctedStep);
      } else {
        bidValueCurr = calculatedBid;
      }
    }

    setBidValue(bidValueCurr);
  };

  useEffect(() => {
    if (item.bidIncrement && highestBid !== 0) {
      const calculatedBid = highestBid + stepBidIncrement * item.bidIncrement;
      if (item.finalPriceSold && calculatedBid >= item.finalPriceSold) {
        setBidValue(item.finalPriceSold);
        // Optional: Cập nhật lại step
        const correctedStep = Math.floor(
          (item.finalPriceSold - highestBid) / item.bidIncrement
        );
        setStepBidIncrement(correctedStep);
      } else {
        setBidValue(calculatedBid);
      }
    }
  }, [highestBid]);

  const handleSubmitBidMethod3 = async () => {
    const validationError = validateBidMethod3(bidValue);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError(null);
    await onPlaceBid(bidValue);
    setLoading(false);
  };

  const checkProcessingBidOfMine = (bids: Message[]): boolean => {
    if (cusid) {
      return !!bids.find(
        (bid) =>
          bid.customerId.toString() === cusid.toString() &&
          bid.status === "Processing"
      );
    }
    return false;
  };

  if (item.lotType === "Public_Auction") {
    const highestBidActual = highestBid ? highestBid : item.startPrice;

    const isAuctionEnded =
      isEndAuctionMethod3 ||
      item.status === "Sold" ||
      item.status === "Passed" ||
      item.status === "Pause" ||
      loading ||
      isEndLot || // Disable when auction is currently ended just for method 3
      checkProcessingBidOfMine(bids) ||
      status === "Pause" ||
      status === "Cancelled";
    return (
      <View className="w-full px-2 pb-5">
        <Text className="mb-2 text-sm font-bold text-center">
          Highest Price:{" "}
          {(highestBidActual ?? 0).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
        <View className="flex-row items-center justify-between gap-3">
          <View className="w-[25%] h-14 border border-gray-300 rounded-md bg-white">
            <Text className="pt-1 text-xs font-semibold text-center">Step</Text>
            <TextInput
              editable={!isAuctionEnded}
              value={stepBidIncrement.toLocaleString()}
              onChangeText={(e) => handleBidChangeMethod3(e)}
              keyboardType="numeric"
              returnKeyType="done"
              className="flex-1 px-2 text-sm font-semibold text-center"
            />
          </View>

          <View className="w-[45%] h-14 flex-row items-center border border-gray-300 rounded-md bg-white">
            <TextInput
              value={bidValue.toLocaleString()}
              editable={false}
              keyboardType="numeric"
              returnKeyType="done"
              className="flex-1 px-2 text-base font-semibold text-center"
            />
          </View>

          <TouchableOpacity
            disabled={isAuctionEnded}
            onPress={handleSubmitBidMethod3}
            className={`w-[20%] h-14 items-center justify-center rounded-md ${
              isAuctionEnded ? "bg-gray-500" : "bg-blue-500"
            }`}>
            <Text className="text-sm font-semibold text-white">BID</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <Text className="mt-2 text-sm text-center text-red-500">{error}</Text>
        )}
      </View>
    );
  }

  return null;
};

export default BidInput;
