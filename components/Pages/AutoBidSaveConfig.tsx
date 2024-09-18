import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Switch,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export type BidAutomationRouteParams = {
  lotId: number;
  lotName: string;
  estimatedPrice: { min: number; max: number };
};

type BidAutomationScreenRouteProp = RouteProp<
  { BidAutomation: BidAutomationRouteParams },
  "BidAutomation"
>;

const AutoBidSaveConfig = () => {
  const navigation = useNavigation();
  const route = useRoute<BidAutomationScreenRouteProp>();
  const { lotId, lotName, estimatedPrice } = route.params;

  const [maxPrice, setMaxPrice] = useState("1300");
  const [startingPrice, setStartingPrice] = useState("500");
  const [nextBidTime, setNextBidTime] = useState("10");
  const [notifyExceeded, setNotifyExceeded] = useState(false);

  const handleIncrement = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter((prev) => (parseInt(prev) + 100).toString());
  };

  const handleDecrement = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter((prev) => Math.max(0, parseInt(prev) - 100).toString());
  };

  const handleSubmit = () => {
    console.log("Submitted automation bid");
    navigation.goBack();
  };

  return (
    <SafeAreaView className="justify-between flex-1 bg-white ">
      <View className="flex-row items-center p-4 mb-6 bg-slate-100">
        <Image
          className="w-12 h-12 mr-4 rounded"
          source={require("../../assets/item-jas/item1.jpg")}
        />
        <View>
          <Text className="text-lg font-semibold">{lotName}</Text>
          <Text className="text-sm text-gray-600">
            Est: ${estimatedPrice.min} - ${estimatedPrice.max}
          </Text>
        </View>
      </View>

      <View className="p-4">
        <Text className="mb-4 text-xl font-semibold">
          Enter Your Config for Automation Bid
        </Text>
        <Text className="mt-4 mb-2">Max Price (USD) &lt;=</Text>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => handleDecrement(setMaxPrice)}
            className="p-2 bg-gray-200 rounded-l">
            <Text className="text-2xl">-</Text>
          </TouchableOpacity>
          <TextInput
            className="flex-1 px-4 py-2 text-lg text-center bg-gray-100"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => handleIncrement(setMaxPrice)}
            className="p-2 bg-gray-200 rounded-r">
            <Text className="text-2xl">+</Text>
          </TouchableOpacity>
        </View>
        <Text className="mt-4 mb-2">Starting Price (USD) &gt;=</Text>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => handleDecrement(setStartingPrice)}
            className="p-2 bg-gray-200 rounded-l">
            <Text className="text-2xl">-</Text>
          </TouchableOpacity>
          <TextInput
            className="flex-1 px-4 py-2 text-lg text-center bg-gray-100"
            value={startingPrice}
            onChangeText={setStartingPrice}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => handleIncrement(setStartingPrice)}
            className="p-2 bg-gray-200 rounded-r">
            <Text className="text-2xl">+</Text>
          </TouchableOpacity>
        </View>
        <Text className="mt-4 mb-2">Next Bid Time (Minutes)</Text>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() =>
              setNextBidTime((prev) =>
                Math.max(1, parseInt(prev) - 1).toString()
              )
            }
            className="p-2 bg-gray-200 rounded-l">
            <Text className="text-2xl">-</Text>
          </TouchableOpacity>
          <TextInput
            className="flex-1 px-4 py-2 text-lg text-center bg-gray-100"
            value={nextBidTime}
            onChangeText={setNextBidTime}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() =>
              setNextBidTime((prev) => (parseInt(prev) + 1).toString())
            }
            className="p-2 bg-gray-200 rounded-r">
            <Text className="text-2xl">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row items-center mb-16">
        <Switch value={notifyExceeded} onValueChange={setNotifyExceeded} />
        <Text className="ml-2">Notify me when my maximum bid is exceeded</Text>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        className="absolute bottom-0 left-0 right-0 py-3 bg-blue-500 rounded-sm">
        <Text className="text-lg font-bold text-center text-white">
          SUBMIT AUTOMATION BID
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AutoBidSaveConfig;
