import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { LotDetail } from "@/app/types/lot_type";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface BidInputProps {
  isEndAuction: boolean;
  highestBid: number;
  item: LotDetail;
  onPlaceBid: (price: number) => Promise<void>;
  onPlaceBidMethod4: (price: number) => Promise<void>;
  reducePrice?: number;
}

const BidInput: React.FC<BidInputProps> = ({
  isEndAuction,
  highestBid,
  item,
  onPlaceBid,
  onPlaceBidMethod4,
  reducePrice,
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
    if (value % (item.bidIncrement ?? 100) !== 0) {
      return `Bid must be a multiple of ${item.bidIncrement?.toLocaleString()}`;
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

  const handleSubmitBidMethod4 = async (price: number) => {
    console.log("Method 4", price);
    if (price > priceLimitofCustomer) {
      setError(
        `Bid must be lower than your price limit (${priceLimitofCustomer?.toLocaleString()})`
      );
      return;
    }
    setLoading(true);
    setError(null);
    await onPlaceBidMethod4(price);
    setLoading(false);
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
              onChangeText={(e) =>
                setBidValue(parseInt(e.replace(/,/g, ""), 10))
              }
              keyboardType="numeric"
              className="flex-1 h-12 px-2 text-sm font-semibold text-center border-gray-300 border-x"
            />
          </View>

          <TouchableOpacity
            disabled={isEndAuction || item.status === "Sold" || loading}
            onPress={handleSubmitBidMethod3}
            className="w-[20%] flex items-center justify-center h-12 bg-blue-500 rounded-md">
            <Text className="text-xs font-semibold text-white">BIDDING</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <Text className="mt-2 text-center text-red-500">{error}</Text>
        )}
      </View>
    );
  }

  if (item.lotType === "Auction_Price_GraduallyReduced") {
    return (
      <View className="w-full p-3">
        <View className="flex items-center justify-between">
          <TouchableOpacity
            disabled={isEndAuction || item.status === "Sold"}
            onPress={() => handleSubmitBidMethod4(reducePrice ?? 0)}
            className={
              isEndAuction || item.status === "Sold"
                ? "w-[50%] flex items-center justify-center h-12 bg-gray-500 rounded-md"
                : "w-[50%] flex items-center justify-center h-12 bg-blue-500 rounded-md"
            }>
            <Text className="text-xl font-semibold text-white">
              {isEndAuction || item.status === "Sold" ? "SOLD" : "BUY NOW"}
            </Text>
            {error && (
              <Text className="mt-2 text-center text-red-500">{error}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
};

export default BidInput;
