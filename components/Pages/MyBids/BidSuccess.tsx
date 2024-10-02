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
    <View className="flex-1 bg-white pt-10">
      {/* Title */}

      {/* Success Icon */}
      <View className="justify-center items-center mb-5">
        <MaterialCommunityIcons name="check-circle" size={100} color="green" />
      </View>

      {/* Success Message */}
      <Text className="text-center text-lg font-bold mb-2">
        BIDDING SUCCESSFULLY
      </Text>
      <Text className="text-center text-base font-semibold text-green-600 mb-4  px-8">
        Congratulations Auction has been successful and you are the winner.
        Please deposit the product, at the latest within 24 hours.
      </Text>

      {/* Product Image */}
      <View className="justify-center items-center ">
        <Image
          source={require("../../../assets/item-jas/item1.jpg")} // Thay thế bằng hình ảnh của sản phẩm thật
          className="w-40 h-40"
          resizeMode="contain"
        />
      </View>

      {/* Bid Details */}
      <View className="bg-white rounded-lg py-5 shadow-md mb-5 px-10">
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

        <View className="h-px bg-gray-400 my-5" />

        <View className="flex-row justify-between">
          <Text className="text-base font-semibold text-gray-600">
            Deposit (10%)
          </Text>
          <Text className="text-lg font-bold text-black">5.200.000 VND</Text>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View className="flex-row justify-between absolute bottom-0 w-full p-4 bg-white">
        <TouchableOpacity
          className="flex-1 p-4 bg-gray-500 rounded-lg mr-2"
          onPress={handleMyBid}
        >
          <Text className="text-white text-center text-lg font-bold">
            My Bid
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 p-4 bg-blue-500 rounded-lg ml-2"
          onPress={handleDeposit}
        >
          <Text className="text-white text-center text-lg font-bold">
            ĐẶT CỌC NGAY
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BidSuccess;
