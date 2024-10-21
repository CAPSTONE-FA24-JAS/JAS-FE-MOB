import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker for dropdown
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { LotDetail } from "@/app/types/lot_type";

interface BidInputProps {
  highestBid: number;
  item: LotDetail;
  onPlaceBid: (price: number) => Promise<void>;
}

const BidInput: React.FC<BidInputProps> = ({
  highestBid,
  item,
  onPlaceBid,
}) => {
  const [bidValue, setBidValue] = useState<number>(highestBid + 100);
  const [step, setStep] = useState<number>(100); // Step value from dropdown
  const [error, setError] = useState<string | null>(null);

  const handleBidChange = (text: string) => {
    const newBid = parseInt(text, 10);
    if (isNaN(newBid)) {
      setError("Please enter a valid number.");
    } else if (newBid <= highestBid) {
      setError(`Bid must be higher than $${highestBid}`);
    } else {
      setError(null);
      setBidValue(newBid);
    }
  };

  const handleSubmitBid = () => {
    if (error) {
      console.log("Invalid bid");
    } else {
      onPlaceBid(bidValue);
      console.log("Bid placed:", bidValue);
    }
  };

  // Render UI for typeBid 3
  if (item.lotType === "Public_Auction") {
    return (
      <View className="w-full px-4 py-2">
        <View className="flex-row items-center justify-center ">
          <View className="border border-gray-300 h-12 w-[25%] rounded-md mr-4">
            <Picker
              selectedValue={step}
              className="h-12 w-[120px]"
              onValueChange={(itemValue: React.SetStateAction<number>) =>
                setStep(itemValue)
              }>
              <Picker.Item label="100" value={100} />
              <Picker.Item label="200" value={200} />
              <Picker.Item label="500" value={500} />
              <Picker.Item label="1000" value={1000} />
            </Picker>
          </View>

          {/* Bid input and increase/decrease buttons */}
          <TouchableOpacity
            onPress={() => setBidValue((prev) => prev - step)}
            className="w-10 h-12 p-2 bg-gray-300">
            <Text className="text-xl text-center ">-</Text>
          </TouchableOpacity>

          <TextInput
            value={bidValue.toString()}
            onChangeText={handleBidChange}
            keyboardType="numeric"
            className="w-32 h-12 px-10 text-xl font-semibold text-center border border-gray-300"
          />

          <TouchableOpacity
            onPress={() => setBidValue((prev) => prev + step)}
            className="w-10 h-12 p-2 bg-gray-300">
            <Text className="text-xl text-center ">+</Text>
          </TouchableOpacity>

          {/* Submit button */}
          <TouchableOpacity
            onPress={handleSubmitBid}
            className="px-3 py-2 ml-4 bg-blue-500 rounded-md">
            <Text className="text-xl font-semibold text-center text-white">
              PUT
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error message */}
        {error && <Text className="mt-2 text-red-500">{error}</Text>}
      </View>
    );
  }

  // Render UI for typeBid 4 (disabled input)
  if (item.lotType === "Secret_Auction") {
    return (
      <View className="flex-row px-4 mx-auto">
        <TextInput
          value={bidValue.toString()}
          editable={false} // Disable input
          className="border px-10 font-semibold text-xl h-12 w-[70%] text-center border-gray-300 bg-gray-100"
        />
        <TouchableOpacity
          onPress={handleSubmitBid}
          className="px-3 py-2 ml-4 bg-blue-500 rounded-md">
          <Text className="text-xl font-semibold text-center text-white">
            PUT
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null; // If no matching typeBid, render nothing
};

export default BidInput;
