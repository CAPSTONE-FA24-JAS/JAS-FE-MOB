import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker for dropdown
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

interface BidInputProps {
  highestBid: number;
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
// Define the types for navigation routes
type RootStackParamList = {
  BidSuccess: undefined;
};

const BidInput: React.FC<BidInputProps> = ({ highestBid, item }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
      navigation.navigate("BidSuccess");
      console.log("Bid placed:", bidValue);
    }
  };

  // Render UI for typeBid 3
  if (item.typeBid === 3) {
    return (
      <View className="px-4 w-full">
        <View className="flex-row items-center justify-center ">
          {/* Step size picker */}
          <View className="border border-gray-300 h-12 w-[25%] rounded-md mr-4">
            <Picker
              selectedValue={step}
              className="h-12 w-[120px]"
              onValueChange={(itemValue: React.SetStateAction<number>) =>
                setStep(itemValue)
              }
            >
              <Picker.Item label="100" value={100} />
              <Picker.Item label="200" value={200} />
              <Picker.Item label="500" value={500} />
              <Picker.Item label="1000" value={1000} />
            </Picker>
          </View>

          {/* Bid input and increase/decrease buttons */}
          <TouchableOpacity
            onPress={() => setBidValue((prev) => prev - step)}
            className="bg-gray-300 w-10 p-2 h-12"
          >
            <Text className="text-lg text-center text-xl">-</Text>
          </TouchableOpacity>

          <TextInput
            value={bidValue.toString()}
            onChangeText={handleBidChange}
            keyboardType="numeric"
            className="border px-10 font-semibold text-xl h-12 w-32 text-center border-gray-300"
          />

          <TouchableOpacity
            onPress={() => setBidValue((prev) => prev + step)}
            className="bg-gray-300 w-10 p-2 h-12"
          >
            <Text className="text-lg text-center text-xl">+</Text>
          </TouchableOpacity>

          {/* Submit button */}
          <TouchableOpacity
            onPress={handleSubmitBid}
            className="bg-blue-500 py-2 px-3 rounded-md ml-4"
          >
            <Text className="text-white text-center font-semibold text-xl">
              PUT
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error message */}
        {error && <Text className="text-red-500 mt-2">{error}</Text>}
      </View>
    );
  }

  // Render UI for typeBid 4 (disabled input)
  if (item.typeBid === 4) {
    return (
      <View className="px-4 flex-row mx-auto">
        <TextInput
          value={bidValue.toString()}
          editable={false} // Disable input
          className="border px-10 font-semibold text-xl h-12 w-[70%] text-center border-gray-300 bg-gray-100"
        />
        <TouchableOpacity
          onPress={handleSubmitBid}
          className="bg-blue-500 py-2 px-3 rounded-md ml-4"
        >
          <Text className="text-white text-center font-semibold text-xl">
            PUT
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null; // If no matching typeBid, render nothing
};

export default BidInput;
