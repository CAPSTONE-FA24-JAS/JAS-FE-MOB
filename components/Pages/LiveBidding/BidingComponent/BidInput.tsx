import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
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
  const [bidValue, setBidValue] = useState<number>(
    () => highestBid + (item.bidIncrement ?? 100)
  );
  const [step, setStep] = useState<number>(() => item.bidIncrement ?? 100);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const priceLimit = useSelector(
    (store: RootState) => store.auth.userResponse?.customerDTO.priceLimit
  );

  const isFinancialProof = item.haveFinancialProof;
  const priceLimitofCustomer = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.priceLimit
  );

  const validateBid = (value: number) => {
    if (isFinancialProof && value > priceLimitofCustomer) {
      return `Bid must be lower than your price limit (${priceLimitofCustomer?.toLocaleString()})`;
    }
    if (value === 0) {
      return "Bid must be higher than 0";
    }
    if (value < highestBid) {
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

  const handleSubmitBid = async () => {
    const validationError = validateBid(bidValue);
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
    await onPlaceBidMethod4(11000);
    setLoading(false);
  };

  const handleBidChange = (newValue: string) => {
    const numericValue = parseInt(newValue.replace(/,/g, ""), 10) || 0;
    setBidValue(numericValue);
    const validationError = validateBid(numericValue);
    setError(validationError);
  };

  const styles = StyleSheet.create({
    pickerItem: {
      fontSize: 14,
      fontWeight: "600",
      color: "#374151",
    },
    picker: {
      height: 48,
      width: "100%",
    },
  });

  if (item.lotType === "Public_Auction") {
    const bidIncrements = [
      item.bidIncrement ?? 100,
      (item.bidIncrement ?? 100) * 2,
      (item.bidIncrement ?? 100) * 5,
      (item.bidIncrement ?? 100) * 10,
    ];

    const handleSubtract = () => {
      if (bidValue - step <= highestBid) {
        return;
      }
      setBidValue((prev) => prev - step);
    };

    return (
      <View className="w-full p-2">
        <View className="">
          <Text className="text-center">Highest Price: ${highestBid}</Text>
        </View>
        <View className="flex-row items-center justify-between gap-2">
          <View className="w-[30%] h-12 border border-gray-300 rounded-md bg-white">
            <Picker
              style={styles.picker}
              selectedValue={step}
              onValueChange={(itemValue: number) => setStep(itemValue)}
              mode="dropdown">
              {bidIncrements.map((increment) => (
                <Picker.Item
                  style={styles.pickerItem}
                  key={increment}
                  label={`${increment.toLocaleString()}`}
                  value={increment}
                />
              ))}
            </Picker>
          </View>

          <View className="w-[40%] flex-row items-center border border-gray-300 rounded-md">
            <TouchableOpacity
              onPress={handleSubtract}
              className="flex items-center justify-center w-10 h-12 bg-gray-100">
              <Text className="text-2xl font-semibold">-</Text>
            </TouchableOpacity>

            <TextInput
              value={bidValue.toLocaleString()}
              onChangeText={handleBidChange}
              keyboardType="numeric"
              className="flex-1 h-12 px-2 text-sm font-semibold text-center border-gray-300 border-x"
            />

            <TouchableOpacity
              onPress={() => setBidValue((prev) => prev + step)}
              className="flex items-center justify-center w-10 h-12 bg-gray-100">
              <Text className="text-2xl font-semibold">+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            disabled={isEndAuction || item.status === "Sold" || loading}
            onPress={handleSubmitBid}
            className="w-[20%] flex items-center justify-center h-12 bg-blue-500 rounded-md">
            <Text className="text-sm font-semibold text-white">BIDDING</Text>
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
