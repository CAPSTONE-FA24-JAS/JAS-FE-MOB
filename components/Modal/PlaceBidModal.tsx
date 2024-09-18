import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import Swiper from "react-native-swiper";

interface PlaceBidModalProps {
  visible: boolean;
  onClose: () => void;
  item: {
    id: number;
    image: string;
    name: string;
    typeBid: number;
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
    if (item.typeBid === 4) {
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
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[90%] bg-white rounded-lg p-4 relative">
          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 z-10"
          >
            <MaterialCommunityIcons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <Text className="text-center text-2xl mt-2 font-bold mb-6">
            Place Bid
          </Text>

          {/* Item details */}
          <View className="flex-row items-center mb-4 shadow-xl bg-gray-200 p-2 rounded-md">
            <Image
              source={{ uri: item.image }}
              className="w-20 h-20 rounded-lg"
            />
            <View className="ml-4">
              <Text className="text-gray-500 text-base">#{item.id}</Text>
              <Text className="font-bold text-base">{item.name}</Text>

              {/* Estimation visibility */}
              {item.typeBid === 3 && (
                <Text className="text-gray-500 text-base">
                  Start price: ${minPrice}
                </Text>
              )}

              {item.typeBid === 4 && (
                <Text className="text-gray-500 text-base">
                  Max Price: ${maxPrice}
                </Text>
              )}
            </View>
          </View>

          {/* Image Slider - How Bidding Works */}
          <View className="h-52 mb-4">
            <Text className="text-center text-lg font-bold text-gray-900 uppercase mb-2">
              How to Biding?
            </Text>
            <Text className="text-center text-lg font-bold text-gray-600   mb-2">
              {item.typeBid === 2
                ? "One-time Bidding Instructions"
                : item.typeBid === 3
                ? "Rising Bid Instructions"
                : "Descending Bid Instructions"}
            </Text>

            <Swiper
              showsPagination={true}
              autoplay={true}
              style={{ height: "100%" }}
            >
              <View className="w-full h-full justify-center items-center">
                {item.typeBid === 2 ? (
                  <Text className="text-gray-800 text-center text-lg mb-16 font-bold">
                    Step 1: Place your secret bid.
                  </Text>
                ) : item.typeBid === 3 ? (
                  <Text className="text-gray-800 text-center text-lg mb-16 font-bold">
                    Step 1: Place your initial bid.
                  </Text>
                ) : item.typeBid === 4 ? (
                  <Text className="text-gray-800 text-center text-lg mb-16 font-bold">
                    Step 1: Wait for price drops.
                  </Text>
                ) : null}
              </View>

              <View className="w-full h-full justify-center items-center">
                {item.typeBid === 2 ? (
                  <Text className="text-gray-800 text-center text-lg mb-16 font-bold">
                    Step 2: Wait for the auction to end.
                  </Text>
                ) : item.typeBid === 3 ? (
                  <Text className="text-gray-800 text-center text-lg mb-16 font-bold">
                    Step 2: Watch as others place bids.
                  </Text>
                ) : item.typeBid === 4 ? (
                  <Text className="text-gray-800 text-center text-lg mb-16 font-bold">
                    Step 2: Accept a price when you're ready.
                  </Text>
                ) : null}
              </View>

              <View className="w-full h-full justify-center items-center">
                {item.typeBid === 2 ? (
                  <Text className="text-gray-800 text-center text-lg mb-16 font-bold">
                    Step 3: Highest bid wins.
                  </Text>
                ) : item.typeBid === 3 ? (
                  <Text className="text-gray-800 text-center text-lg mb-16 font-bold">
                    Step 3: Continue bidding to stay in the lead.
                  </Text>
                ) : item.typeBid === 4 ? (
                  <Text className="text-gray-800 text-center text-lg mb-16 font-bold">
                    Step 3: First bidder wins.
                  </Text>
                ) : null}
              </View>
            </Swiper>
          </View>

          {/* Bid Input */}
          <Text className="text-lg font-bold text-lg text-center mt-6 mb-2">
            Enter Your Bid ($)
          </Text>

          {/* Conditional Input Field Logic */}
          <View className="flex-row justify-center items-center mb-6">
            {item.typeBid === 4 ? (
              <TextInput
                value={bidValue.toString()}
                className="border border-gray-300 px-4 text-center text-xl font-semibold w-40 h-12 bg-gray-200"
                editable={false} // Disable input for typeBid 4
              />
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleDecreaseBid}
                  className="px-6 py-3 bg-gray-200 rounded-l-lg"
                >
                  <Text className="text-xl">-</Text>
                </TouchableOpacity>
                <TextInput
                  value={bidValue.toString()}
                  onChangeText={(text) => {
                    const numericValue = parseInt(text, 10);
                    if (!isNaN(numericValue)) {
                      setBidValue(numericValue);
                    }
                  }}
                  className="border border-gray-300 px-4 text-center text-xl font-semibold w-40 h-12"
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  onPress={handleIncreaseBid}
                  className="px-6 py-3 bg-gray-200 rounded-r-lg"
                >
                  <Text className="text-xl">+</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => onSubmitBid(bidValue)}
            className="py-3 bg-blue-500 rounded-lg"
          >
            <Text className="font-semibold text-lg text-center text-white">
              SUBMIT BID
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PlaceBidModal;
