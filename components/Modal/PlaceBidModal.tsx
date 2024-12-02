import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Swiper from "react-native-swiper";

interface PlaceBidModalProps {
  visible: boolean;
  onClose: () => void;
  item: {
    id: number;
    image: string;
    name: string;
    typeBid: string;
  };
  minPrice: number;
  maxPrice: number;
  onSubmitBid: (bidValue: number) => void;
}

const PlaceBidModal: React.FC<PlaceBidModalProps> = ({
  visible,
  onClose,
  item,
  minPrice,
  maxPrice,
  onSubmitBid,
}) => {
  const [bidValue, setBidValue] = useState<number>(minPrice);

  // For typeBid 4, select a random value between minPrice and maxPrice
  useEffect(() => {
    if (item.typeBid === "Auction_Price_GraduallyReduced") {
      const randomBid = Math.floor(
        Math.random() * (maxPrice - minPrice + 1) + minPrice
      );
      setBidValue(randomBid);
    }
  }, [minPrice, maxPrice, item.typeBid]);

  const handleIncreaseBid = () => {
    setBidValue((prev) => prev + 1);
  };

  const handleDecreaseBid = () => {
    if (bidValue > minPrice) {
      setBidValue((prev) => prev - 1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="w-[90%] bg-white rounded-lg p-4 relative">
          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute z-10 top-4 right-4">
            <MaterialCommunityIcons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <Text className="mt-2 mb-6 text-2xl font-bold text-center">
            Place Bid
          </Text>

          {/* Item details */}
          <View className="flex-row items-center p-2 mb-4 bg-gray-200 rounded-md shadow-xl">
            <Image
              source={{ uri: item.image }}
              className="w-20 h-20 rounded-lg"
            />
            <View className="ml-4">
              <Text className="text-base text-gray-500">#{item.id}</Text>
              <Text className="text-base font-bold">{item.name}</Text>

              {/* Estimation visibility */}
              {item.typeBid === "Public_Auction" && (
                <Text className="text-base text-gray-500">
                  Start price:{" "}
                  {minPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              )}

              {item.typeBid === "Auction_Price_GraduallyReduced" && (
                <Text className="text-base text-gray-500">
                  Max Price:{" "}
                  {maxPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              )}
            </View>
          </View>

          {/* Image Slider - How Bidding Works */}
          <View className="mb-4 h-52">
            <Text className="mb-2 text-lg font-bold text-center text-gray-900 uppercase">
              How to Biding?
            </Text>
            <Text className="mb-2 text-lg font-bold text-center text-gray-600">
              {item.typeBid === "Secret_Auction"
                ? "One-time Bidding Instructions"
                : item.typeBid === "Public_Auction"
                ? "Rising Bid Instructions"
                : "Descending Bid Instructions"}
            </Text>

            <Swiper
              showsPagination={true}
              autoplay={true}
              style={{ height: "100%" }}>
              <View className="items-center justify-center w-full h-full">
                {item.typeBid === "Secret_Auction" ? (
                  <Text className="mb-16 text-lg font-bold text-center text-gray-800">
                    Step 1: Place your secret bid.
                  </Text>
                ) : item.typeBid === "Public_Auction" ? (
                  <Text className="mb-16 text-lg font-bold text-center text-gray-800">
                    Step 1: Place your initial bid.
                  </Text>
                ) : item.typeBid === "Auction_Price_GraduallyReduced" ? (
                  <Text className="mb-16 text-lg font-bold text-center text-gray-800">
                    Step 1: Wait for price drops.
                  </Text>
                ) : null}
              </View>

              <View className="items-center justify-center w-full h-full">
                {item.typeBid === "Secret_Auction" ? (
                  <Text className="mb-16 text-lg font-bold text-center text-gray-800">
                    Step 2: Wait for the auction to end.
                  </Text>
                ) : item.typeBid === "Public_Auction" ? (
                  <Text className="mb-16 text-lg font-bold text-center text-gray-800">
                    Step 2: Watch as others place bids.
                  </Text>
                ) : item.typeBid === "Auction_Price_GraduallyReduced" ? (
                  <Text className="mb-16 text-lg font-bold text-center text-gray-800">
                    Step 2: Accept a price when you're ready.
                  </Text>
                ) : null}
              </View>

              <View className="items-center justify-center w-full h-full">
                {item.typeBid === "Secret_Auction" ? (
                  <Text className="mb-16 text-lg font-bold text-center text-gray-800">
                    Step 3: Highest bid wins.
                  </Text>
                ) : item.typeBid === "Public_Auction" ? (
                  <Text className="mb-16 text-lg font-bold text-center text-gray-800">
                    Step 3: Continue bidding to stay in the lead.
                  </Text>
                ) : item.typeBid === "Auction_Price_GraduallyReduced" ? (
                  <Text className="mb-16 text-lg font-bold text-center text-gray-800">
                    Step 3: First bidder wins.
                  </Text>
                ) : null}
              </View>
            </Swiper>
          </View>

          {/* Bid Input */}
          <Text className="mt-6 mb-2 text-lg font-bold text-center">
            Enter Your Bid (VND)
          </Text>

          {/* Conditional Input Field Logic */}
          <View className="flex-row items-center justify-center mb-6">
            {item.typeBid === "Auction_Price_GraduallyReduced" ? (
              <TextInput
                returnKeyType="done"
                value={bidValue.toString()}
                className="w-40 h-12 px-4 text-xl font-semibold text-center bg-gray-200 border border-gray-300"
                editable={false} // Disable input for typeBid 4
              />
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleDecreaseBid}
                  className="px-6 py-3 bg-gray-200 rounded-l-lg">
                  <Text className="text-xl">-</Text>
                </TouchableOpacity>
                <TextInput
                  returnKeyType="done"
                  value={bidValue.toString()}
                  onChangeText={(text) => {
                    const numericValue = parseInt(text, 10);
                    if (!isNaN(numericValue)) {
                      setBidValue(numericValue);
                    }
                  }}
                  className="w-40 h-12 px-4 text-xl font-semibold text-center border border-gray-300"
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  onPress={handleIncreaseBid}
                  className="px-6 py-3 bg-gray-200 rounded-r-lg">
                  <Text className="text-xl">+</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => onSubmitBid(bidValue)}
            className="py-3 bg-blue-500 rounded-lg">
            <Text className="text-lg font-semibold text-center text-white">
              SUBMIT BID
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PlaceBidModal;
