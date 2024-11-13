import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Switch,
  Modal,
  FlatList,
  ListRenderItem,
  Alert,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView } from "react-native-gesture-handler";
import { LotDetail } from "@/app/types/lot_type";
import { setAutoBidConfig } from "@/api/lotAPI";

type RootStackParamList = {
  BidAutomation: BidAutomationRouteParams;
};

type BidAutomationRouteParams = {
  customerLotId: number;
  lotName: string;
  startBid: number;
  estimatedPrice: { min: number };
  lotDetail: LotDetail;
};

type BidAutomationScreenRouteProp = RouteProp<
  RootStackParamList,
  "BidAutomation"
>;
type BidAutomationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BidAutomation"
>;

interface SavedConfig {
  id: number;
  status: boolean;
  maxPrice: number;
  startingPrice: number;
  nextBidTime: number;
}

// {
//   "minPrice": 0,
//   "maxPrice": 0,
//   "numberOfPriceStep": 0,
//   "timeIncrement": 0, // user chọn theo phút
//   "customerLotId": 0
// }

const AutoBidSaveConfig: React.FC = () => {
  const navigation = useNavigation<BidAutomationScreenNavigationProp>();
  const route = useRoute<BidAutomationScreenRouteProp>();
  const { customerLotId, startBid, lotName, estimatedPrice, lotDetail } =
    route.params;
  // Initial state dynamically set from route params
  const [maxPrice, setMaxPrice] = useState<number>(estimatedPrice.min + 300);
  const [startingPrice, setStartingPrice] = useState<number>(
    estimatedPrice.min
  );
  const [nextBidTime, setNextBidTime] = useState<number>(10); // Default starting time for bid increment
  const [numberOfPriceStep, setNumberOfPriceStep] = useState<number>(1);

  const [notifyExceeded, setNotifyExceeded] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([
    {
      id: 1,
      status: true,
      maxPrice: 1500,
      startingPrice: 600,
      nextBidTime: 15,
    },
    {
      id: 2,
      status: false,
      maxPrice: 2000,
      startingPrice: 800,
      nextBidTime: 20,
    },
    {
      id: 3,
      status: true,
      maxPrice: 2500,
      startingPrice: 1000,
      nextBidTime: 25,
    },
  ]);

  // console.log("lotDetail", lotDetail);

  // Update `maxPrice` constraint based on `numberOfPriceStep` change
  useEffect(() => {
    const minMaxPrice = estimatedPrice.min + numberOfPriceStep;
    if (maxPrice < minMaxPrice) {
      setMaxPrice(minMaxPrice);
    }
  }, [numberOfPriceStep, estimatedPrice.min, maxPrice]);

  const handleIncrement = (
    setter: React.Dispatch<React.SetStateAction<number>>
  ): void => {
    setter((prev) => prev + 100);
  };

  const handleDecrement = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    minValue: number
  ): void => {
    setter((prev) => Math.max(minValue, prev - 100));
  };

  // {
  //   "minPrice": 0,
  //   "maxPrice": 0,
  //   "numberOfPriceStep": 0,
  //   "timeIncrement": 0, // user chọn theo phút
  //   "customerLotId": 0
  // }

  // In your handleSubmit function
  const handleSubmit = async (): Promise<void> => {
    // Validate conditions
    if (maxPrice <= startingPrice) {
      setErrorMessage("Max price must be greater than min price.");
      return;
    }
    if (maxPrice < numberOfPriceStep + startingPrice) {
      setErrorMessage("Max price must be at least min price plus price step.");
      return;
    }
    if (numberOfPriceStep > 20) {
      setErrorMessage("Price step must be at least 20.");
      return;
    }
    if (nextBidTime < 1) {
      setErrorMessage("Bid time increment must be at least 1 minute.");
      return;
    }

    // Clear any previous error message
    setErrorMessage(null);
    try {
      console.log("Submitted automation bid", {
        minPrice: startingPrice,
        maxPrice: maxPrice,
        numberOfPriceStep: numberOfPriceStep,
        timeIncrement: nextBidTime,
        customerLotId,
      });

      // Call setAutoBidConfig API
      await setAutoBidConfig(
        startingPrice,
        maxPrice,
        numberOfPriceStep,
        nextBidTime,
        customerLotId
      );

      // On success, navigate back
      navigation.goBack();
    } catch (error: any) {
      // If there's an error, show an alert with the API error message
      Alert.alert(
        "Error",
        error.message || "Failed to set auto-bid configuration."
      );
    }
  };
  const handleStepChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 20) {
      setNumberOfPriceStep(parsedValue);
    } else {
      setNumberOfPriceStep(0); // Default to 0 if out of range or invalid
    }
  };

  const applyConfig = (config: SavedConfig): void => {
    setStartingPrice(config.startingPrice);
    setMaxPrice(config.maxPrice);
    setNextBidTime(config.nextBidTime);
    setNotifyExceeded(config.status);
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Lot details */}
      <View className="flex-row p-4 mb-6 bg-slate-100 mx-auto mt-6 rounded-lg w-[90%]">
        <Image
          className="w-20 h-20 mr-4 rounded-md"
          source={{
            uri:
              lotDetail?.jewelry?.imageJewelries[0]?.imageLink ||
              lotDetail.auction.imageLink,
          }}
        />
        <View className="flex-row justify-between w-[70%]">
          <View className="w-[80%]">
            <Text className="text-lg font-semibold ">{lotName}</Text>
            <Text className="text-sm text-gray-600">
              Min price:{" "}
              {startBid.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
            <Text className="text-sm text-gray-600">
              EST:{" "}
              {estimatedPrice.min.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}{" "}
              - Increasing
            </Text>
          </View>
          <Text className="font-bold text-base text-gray-600">
            #{lotDetail.id}
          </Text>
        </View>
      </View>

      {/* Configurations */}
      <ScrollView className="flex-1 px-6">
        <Text className="mb-4 text-xl font-semibold">
          Enter Your Config for Automation Bid
        </Text>
        <View className="mx-auto w-[90%]">
          {/* Min Price input */}
          <Text className="mt-4 mb-2 font-semibold uppercase text-base text-gray-600">
            Min Price (VND) &gt;=
          </Text>
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() =>
                handleDecrement(setStartingPrice, estimatedPrice.min)
              }
              className={`w-12 py-1 bg-gray-200 rounded-l-lg ${
                startingPrice <= estimatedPrice.min ? "opacity-50" : ""
              }`}
              disabled={startingPrice <= estimatedPrice.min}
            >
              <Text className="text-4xl text-center">-</Text>
            </TouchableOpacity>
            <TextInput
              className="flex-1 px-4 py-2 text-lg text-center bg-gray-100"
              value={startingPrice.toString()}
              onChangeText={(value) => {
                const num = parseInt(value, 10);
                if (!isNaN(num) && num >= estimatedPrice.min) {
                  setStartingPrice(num);
                } else if (value === "") {
                  setStartingPrice(estimatedPrice.min);
                }
              }}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={() => handleIncrement(setStartingPrice)}
              className="w-12 py-1 bg-gray-200 rounded-r-lg"
            >
              <Text className="text-2xl text-center">+</Text>
            </TouchableOpacity>
          </View>

          {/* Max Price input */}
          <Text className="mt-4 mb-2 font-semibold uppercase text-base text-gray-600">
            Max Price (VND) &lt;=
          </Text>
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() =>
                handleDecrement(
                  setMaxPrice,
                  estimatedPrice.min + numberOfPriceStep
                )
              }
              className={`w-12 py-1 bg-gray-200 rounded-l-lg ${
                maxPrice <= estimatedPrice.min + numberOfPriceStep
                  ? "opacity-50"
                  : ""
              }`}
              disabled={maxPrice <= estimatedPrice.min + numberOfPriceStep}
            >
              <Text className="text-4xl text-center">-</Text>
            </TouchableOpacity>
            <TextInput
              className="flex-1 px-4 py-2 text-lg text-center bg-gray-100"
              value={maxPrice.toString()}
              onChangeText={(value) => {
                const num = parseInt(value, 10);
                const minMax = estimatedPrice.min + numberOfPriceStep;
                if (!isNaN(num) && num >= minMax) {
                  setMaxPrice(num);
                } else if (value === "") {
                  setMaxPrice(minMax);
                }
              }}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={() => handleIncrement(setMaxPrice)}
              className="w-12 py-1 bg-gray-200 rounded-r-lg"
            >
              <Text className="text-2xl text-center">+</Text>
            </TouchableOpacity>
          </View>

          {/* Price Step input */}
          <Text className="mt-4 mb-2 font-semibold uppercase text-base text-gray-600">
            Price Step (VND)
          </Text>
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() =>
                setNumberOfPriceStep((prev) => Math.max(0, prev - 1))
              }
              className={`w-12 py-1 bg-gray-200 rounded-l-lg ${
                numberOfPriceStep <= 0 ? "opacity-50" : ""
              }`}
              disabled={numberOfPriceStep <= 0}
            >
              <Text className="text-4xl text-center">-</Text>
            </TouchableOpacity>
            <TextInput
              className="flex-1 px-4 py-2 text-lg text-center bg-gray-100"
              value={numberOfPriceStep.toString()}
              onChangeText={handleStepChange}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={() =>
                setNumberOfPriceStep((prev) => Math.min(20, prev + 1))
              }
              className="w-12 py-1 bg-gray-200 rounded-r-lg"
              disabled={numberOfPriceStep >= 20}
            >
              <Text className="text-2xl text-center">+</Text>
            </TouchableOpacity>
          </View>

          {/* Next Bid Time input */}
          <Text className="mt-4 mb-2 font-semibold uppercase text-base text-gray-600">
            Next Bid Time (Minutes)
          </Text>
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => setNextBidTime((prev) => Math.max(1, prev - 1))}
              className={`w-12 py-1 bg-gray-200 rounded-l-lg ${
                nextBidTime <= 1 ? "opacity-50" : ""
              }`}
              disabled={nextBidTime <= 1}
            >
              <Text className="text-4xl text-center">-</Text>
            </TouchableOpacity>
            <TextInput
              className="flex-1 px-4 py-2 text-lg text-center bg-gray-100"
              value={nextBidTime.toString()}
              onChangeText={(value) => {
                const num = parseInt(value, 10);
                if (!isNaN(num) && num >= 1) {
                  setNextBidTime(num);
                } else if (value === "") {
                  setNextBidTime(1);
                }
              }}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={() => setNextBidTime((prev) => prev + 1)}
              className="w-12 py-1 bg-gray-200 rounded-r-lg"
            >
              <Text className="text-2xl text-center">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notify Exceeded Switch */}
        <View className="flex-row items-center px-4 mb-16">
          <Switch value={notifyExceeded} onValueChange={setNotifyExceeded} />
          <Text className="ml-2">
            Notify me when my maximum bid is exceeded
          </Text>
        </View>
        {errorMessage && (
          <Text className="text-red-500 text-center mt-4">{errorMessage}</Text>
        )}
      </ScrollView>
      {/* Error Message Display */}

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="absolute bottom-0 left-0 right-0 py-3 bg-blue-500"
      >
        <Text className="text-lg font-bold text-center text-white">
          SUBMIT AUTOMATION BID
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AutoBidSaveConfig;
