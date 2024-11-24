import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView } from "react-native-gesture-handler";
import { LotDetail } from "@/app/types/lot_type";
import { setAutoBidConfig } from "@/api/lotAPI";
import DropDownPicker from "react-native-dropdown-picker";
import { Image } from "react-native";

type RootStackParamList = {
  BidAutomation: BidAutomationRouteParams;
  LotDetail: { id: number };
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

const AutoBidSaveConfig: React.FC = () => {
  const navigation = useNavigation<BidAutomationScreenNavigationProp>();
  const route = useRoute<BidAutomationScreenRouteProp>();
  const { customerLotId, lotName, estimatedPrice, lotDetail } = route.params;

  const [startingPrice, setStartingPrice] = useState<number>(
    estimatedPrice.min
  );
  const [maxPrice, setMaxPrice] = useState<number>(estimatedPrice.min + 300);
  const [numberOfPriceStep, setNumberOfPriceStep] = useState<number>(1);
  const [nextBidTime, setNextBidTime] = useState<number>(1); // Default to 1 minute
  const [step, setStep] = useState<number>(10000); // Default step size

  // Dropdown states for both pickers
  const [stepMin, setStepMin] = useState<number>(10000);
  const [dropdownMinOpen, setDropdownMinOpen] = useState<boolean>(false);

  const [stepMax, setStepMax] = useState<number>(10000);
  const [dropdownMaxOpen, setDropdownMaxOpen] = useState<boolean>(false);
  const [items, setItems] = useState<{ label: string; value: number }[]>([
    { label: "50,000", value: 50000 },
    { label: "100,000", value: 100000 },
    { label: "200,000", value: 200000 },
    { label: "500,000", value: 500000 },
    { label: "1,000,000", value: 1000000 },
  ]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const minPrice = estimatedPrice.min;
  const bidIncrement = lotDetail.bidIncrement;

  // Validation logic when submitting
  const handleSubmit = async (): Promise<void> => {
    if (startingPrice < minPrice) {
      setErrorMessage(
        `Min price must be greater than or equal to ${minPrice.toLocaleString(
          "vi-VN",
          { style: "currency", currency: "VND" }
        )}.`
      );
      return;
    }
    if (maxPrice < minPrice + (bidIncrement ?? 0) * numberOfPriceStep) {
      setErrorMessage(
        `Max price must be greater than or equal to ${(
          minPrice +
          (bidIncrement ?? 0) * numberOfPriceStep
        ).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}.`
      );
      return;
    }
    if (numberOfPriceStep < 1) {
      setErrorMessage("Number of price steps must be at least 1.");
      return;
    }
    if (nextBidTime < 1 || nextBidTime > 10) {
      setErrorMessage("Time increment must be between 1 and 10 minutes.");
      return;
    }

    setErrorMessage(null);
    try {
      await setAutoBidConfig(
        startingPrice,
        maxPrice,
        numberOfPriceStep,
        nextBidTime,
        customerLotId
      );
      Alert.alert("Success", "Automation bid configuration has been saved!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to save auto-bid configuration."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16 }}>
          <View className="flex-row w-full p-4 mx-auto mt-6 mb-6 rounded-lg bg-slate-100">
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
                  {estimatedPrice.min.toLocaleString("vi-VN", {
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
              <Text className="text-base font-bold text-gray-600">
                #{lotDetail.id}
              </Text>
            </View>
          </View>
          {/* Min Price Input */}
          <Text className="mt-2 mb-2 text-base font-semibold text-gray-600">
            Min Price (VND)
          </Text>
          <View className="flex-row items-center mb-4">
            <DropDownPicker
              open={dropdownMinOpen}
              value={stepMin}
              items={items}
              setOpen={setDropdownMinOpen}
              onOpen={() => setDropdownMaxOpen(false)} // Close the other dropdown
              setValue={setStepMin}
              setItems={setItems}
              containerStyle={{ width: 120, marginRight: 10 }}
              placeholder="Step"
            />
            <TouchableOpacity
              onPress={() =>
                setStartingPrice((prev) => Math.max(10000, prev - stepMin))
              }
              className="px-4 py-2 bg-gray-200 rounded-l-lg">
              <Text className="text-2xl  h-[35px]">-</Text>
            </TouchableOpacity>
            <TextInput
              className="flex-1 px-4 py-2 text-center h-[50px] font-semibold text-lg bg-gray-100"
              keyboardType="numeric"
              value={startingPrice.toString()}
              onChangeText={(value) => {
                const parsedValue = parseInt(value, 10);
                setStartingPrice(isNaN(parsedValue) ? 10000 : parsedValue);
              }}
            />
            <TouchableOpacity
              onPress={() => setStartingPrice((prev) => prev + stepMin)}
              className="px-4 py-2 bg-gray-200 rounded-r-lg">
              <Text className="text-xl h-[35px]">+</Text>
            </TouchableOpacity>
          </View>

          {/* Max Price Input */}
          <Text className="mt-4 mb-2 text-base font-semibold text-gray-600">
            Max Price (VND)
          </Text>
          <View
            className="flex-row items-center mb-4"
            style={{ zIndex: dropdownMinOpen ? 2 : 1, marginBottom: 10 }}>
            <DropDownPicker
              open={dropdownMaxOpen}
              value={stepMax}
              items={items}
              setOpen={setDropdownMaxOpen}
              onOpen={() => setDropdownMinOpen(false)} // Close the other dropdown
              setValue={setStepMax}
              setItems={setItems}
              containerStyle={{ width: 120, marginRight: 10 }}
              placeholder="Step"
            />

            <TouchableOpacity
              onPress={() =>
                setMaxPrice((prev) => Math.max(startingPrice, prev - stepMax))
              }
              className="px-4 py-2 bg-gray-200 rounded-l-lg">
              <Text className="text-2xl  h-[35px]">-</Text>
            </TouchableOpacity>
            <TextInput
              className="flex-1 px-4 py-2 text-center font-semibold  h-[50px] text-lg bg-gray-100"
              keyboardType="numeric"
              value={maxPrice.toString()}
              onChangeText={(value) => {
                const parsedValue = parseInt(value, 10);
                setMaxPrice(isNaN(parsedValue) ? startingPrice : parsedValue);
              }}
            />
            <TouchableOpacity
              onPress={() => setMaxPrice((prev) => prev + stepMax)}
              className="px-4 py-2 bg-gray-200 rounded-r-lg">
              <Text className="text-xl  h-[35px]">+</Text>
            </TouchableOpacity>
          </View>

          {/* Time Increment Input */}
          <Text className="mt-4 mb-2 text-base font-semibold text-gray-600">
            Time Increment (1-10 minutes)
          </Text>
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => setNextBidTime((prev) => Math.max(1, prev - 1))}
              className={`px-4 py-2 bg-gray-300 rounded-l-lg ${
                nextBidTime <= 1 ? "opacity-50" : ""
              }`}
              disabled={nextBidTime <= 1}>
              <Text className="text-2xl  h-[35px]">-</Text>
            </TouchableOpacity>
            <TextInput
              className="flex-1 px-4 py-2  font-semibold  h-[50px] text-lg text-center bg-gray-100"
              keyboardType="numeric"
              value={nextBidTime.toString()}
              onChangeText={(value) => {
                const parsedValue = parseInt(value, 10);
                setNextBidTime(
                  isNaN(parsedValue)
                    ? 1
                    : Math.min(10, Math.max(1, parsedValue))
                );
              }}
            />
            <TouchableOpacity
              onPress={() => setNextBidTime((prev) => Math.min(10, prev + 1))}
              className="px-4 py-2 bg-gray-200 rounded-r-lg">
              <Text className="text-xl  h-[35px]">+</Text>
            </TouchableOpacity>
          </View>

          {/* Number of Price Steps */}
          <Text className="mt-4 mb-2 text-base font-semibold text-gray-600">
            Number of Price Steps (N x{" "}
            {bidIncrement?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
            )
          </Text>
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() =>
                setNumberOfPriceStep((prev) => Math.max(1, prev - 1))
              }
              className={`px-4 py-2 bg-gray-300 rounded-l-lg ${
                numberOfPriceStep <= 1 ? "opacity-50" : ""
              }`}
              disabled={numberOfPriceStep <= 1}>
              <Text className="text-2xl  h-[35px]">-</Text>
            </TouchableOpacity>
            <TextInput
              className="flex-1 px-4 py-2  font-semibold  h-[50px] text-lg  text-center bg-gray-100"
              keyboardType="numeric"
              value={numberOfPriceStep.toString()}
              onChangeText={(value) => {
                const parsedValue = parseInt(value, 10);
                setNumberOfPriceStep(isNaN(parsedValue) ? 1 : parsedValue);
              }}
            />
            <TouchableOpacity
              onPress={() => setNumberOfPriceStep((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded-r-lg">
              <Text className="text-xl  h-[35px]">+</Text>
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {errorMessage && (
            <Text className="mt-4 text-red-500">{errorMessage}</Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="py-3 mt-8 bg-blue-500 rounded-md">
            <Text className="text-lg font-bold text-center text-white">
              SUBMIT AUTOMATION BID
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AutoBidSaveConfig;
