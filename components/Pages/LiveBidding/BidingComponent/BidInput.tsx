import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ToastAndroid,
} from "react-native";
import { LotDetail } from "@/app/types/lot_type";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Message } from "@/hooks/useBiddingMethod3";

interface BidInputProps {
  highestBid: number;
  item: LotDetail;
  onPlaceBid: (price: number) => Promise<void>;
  isEndAuctionMethod3: boolean;
  resultBidding?: string;
  setResultBidding: React.Dispatch<React.SetStateAction<string>>;
  isEndLot: boolean; //just for method 3
  bids: Message[];
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
    (store: RootState) => store.auth.userResponse?.customerDTO.priceLimit
  );

  const isFinancialProof = item.haveFinancialProof;
  const priceLimitofCustomer = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.priceLimit
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
      bidValueCurr = numericValue * item.bidIncrement + highestBid;
    }

    setBidValue(bidValueCurr);
  };

  useEffect(() => {
    if (item.bidIncrement && highestBid !== 0) {
      setBidValue(highestBid + stepBidIncrement * item.bidIncrement);
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
    return (
      <View className="w-full p-2">
        <Text className="text-sm font-bold text-center">
          Highest Price: ${highestBid}
        </Text>
        <View className="flex-row items-center justify-between gap-2">
          <View className="w-[20%] h-12 border border-gray-300 rounded-md bg-white">
            <Text className="text-sm font-semibold text-center">Step</Text>
            <TextInput
              value={stepBidIncrement.toLocaleString()}
              onChangeText={(e) => handleBidChangeMethod3(e)}
              keyboardType="numeric"
              className="flex-1 h-12 px-2 text-sm font-semibold text-center border-gray-300 border-x"
            />
          </View>

          <View className="w-[50%] flex-row items-center border border-gray-300 rounded-md">
            <TextInput
              value={bidValue.toLocaleString()}
              editable={false}
              keyboardType="numeric"
              className="flex-1 h-12 px-2 text-sm font-semibold text-center border-gray-300 border-x"
            />
          </View>

          <TouchableOpacity
            disabled={
              isEndAuctionMethod3 ||
              item.status === "Sold" ||
              item.status === "Passed" ||
              loading ||
              isEndLot || // Disable when auction is currently ended just for method 3
              checkProcessingBidOfMine(bids)
            }
            onPress={handleSubmitBidMethod3}
            className={
              isEndAuctionMethod3 ||
              item.status === "Sold" ||
              item.status === "Passed" ||
              loading ||
              isEndLot || // Disable when auction is currently ended just for method 3
              checkProcessingBidOfMine(bids)
                ? "w-[20%] flex items-center justify-center h-12 bg-gray-500 rounded-md"
                : "w-[20%] flex items-center justify-center h-12 bg-blue-500 rounded-md "
            }>
            <Text className="text-xs font-semibold text-white">BIDDING</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <Text className="mt-2 text-center text-red-500">{error}</Text>
        )}
      </View>
    );
  }

  return null;
};

export default BidInput;
