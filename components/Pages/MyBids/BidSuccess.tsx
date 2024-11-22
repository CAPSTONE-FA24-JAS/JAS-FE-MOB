import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Sử dụng icon checkmark
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the types for navigation routes
type RootStackParamList = {
  InvoiceDetailConfirm: undefined;
  MyBids: undefined;
};

const BidSuccess: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleMyBid = () => {
    navigation.navigate("MyBids");
  };
  const handleDeposit = () => {
    navigation.navigate("InvoiceDetailConfirm");
  };

  return (
    <View className="flex-1 pt-10 bg-white">
      {/* Title */}

      {/* Success Icon */}
      <View className="items-center justify-center mb-5">
        <MaterialCommunityIcons name="check-circle" size={100} color="green" />
      </View>

      {/* Success Message */}
      <Text className="mb-2 text-lg font-bold text-center">
        BIDDING SUCCESSFULLY
      </Text>
      <Text className="px-8 mb-4 text-base font-semibold text-center text-green-600">
        Congratulations Auction has been successful and you are the winner.
        Please deposit the product, at the latest within 24 hours.
      </Text>

      {/* Product Image */}
      <View className="items-center justify-center ">
        <Image
          source={require("../../../assets/item-jas/item1.jpg")} // Thay thế bằng hình ảnh của sản phẩm thật
          className="w-40 h-40"
          resizeMode="contain"
        />
      </View>

      {/* Bid Details */}
      <View className="px-10 py-5 mb-5 bg-white rounded-lg shadow-md">
        <View className="flex-row justify-between mb-3">
          <Text className="text-base font-semibold text-gray-600">
            Order Code
          </Text>
          <Text className="text-base font-bold text-black">#99999</Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-base font-semibold text-gray-600">
            Customer
          </Text>
          <Text className="text-base font-bold text-black">John Smith</Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-base font-semibold text-gray-600">
            Name Product
          </Text>
          <Text className="text-base font-bold text-black text-right w-[70%]">
            Tiffany & Co. Soleste Tanzanite And Diamond Earrings
          </Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-base font-semibold text-gray-600">Product</Text>
          <Text className="text-base font-bold text-black">
            Diamond Necklace
          </Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-base font-semibold text-gray-600">Price</Text>
          <Text className="text-base font-bold text-black">35.200.000 VND</Text>
        </View>
        {/* <View className="flex-row justify-between">
          <Text className="text-base font-semibold text-gray-400">Total</Text>
          <Text className="text-lg font-bold text-gray-400">35.200.000 VND</Text>
        </View> */}

        <View className="h-px my-5 bg-gray-400" />

        <View className="flex-row justify-between">
          <Text className="text-base font-semibold text-gray-600">
            Deposit (10%)
          </Text>
          <Text className="text-lg font-bold text-black">5.200.000 VND</Text>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View className="absolute bottom-0 flex-row justify-between w-full p-4 bg-white">
        <TouchableOpacity
          className="flex-1 p-4 mr-2 bg-gray-500 rounded-lg"
          onPress={handleMyBid}>
          <Text className="text-lg font-bold text-center text-white">
            My Bid
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 p-4 ml-2 bg-blue-500 rounded-lg"
          onPress={handleDeposit}>
          <Text className="text-lg font-bold text-center text-white">
            ĐẶT CỌC NGAY
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BidSuccess;
