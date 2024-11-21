import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Sử dụng icon checkmark
import { router, useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { MyBidData } from "@/app/types/bid_type";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
// Define the types for navigation routes
type RootStackParamList = {
  HomePage: undefined;
  InvoiceList: undefined;
  PaymentSuccess: {
    invoiceId?: number;
    itemDetailBid: MyBidData;
    yourMaxBid: number;
    totalPrice: number;
  };
};

type PaymentSuccessRouteProp = RouteProp<RootStackParamList, "PaymentSuccess">;
type PaymentSuccessNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PaymentSuccess"
>;

const PaymentSuccess: React.FC = () => {
  const navigation = useNavigation<PaymentSuccessNavigationProp>();
  const route = useRoute<PaymentSuccessRouteProp>();
  const user = useSelector((state: RootState) => state.auth.userResponse);
  const { invoiceId, itemDetailBid, yourMaxBid, totalPrice } = route.params;

  console.log("====================================");
  console.log("route.params", invoiceId, "itemDetailBid", itemDetailBid);
  console.log("====================================");

  const handleHome = () => {
    navigation.navigate("HomePage");
  };
  const handleInvoiceList = () => {
    // Navigate to 'InvoiceList' through 'Account' stack
    navigation.navigate("InvoiceList");
  };

  // Calculate the total price

  return (
    <View className="flex-1 bg-white pt-20 ">
      {/* Payment Success Title */}
      {/* <Text className="text-center text-2xl font-bold mb-5">
        Payment Success
      </Text> */}

      {/* Success Icon */}
      <View className="justify-center items-center mb-5">
        <MaterialCommunityIcons name="check-circle" size={100} color="green" />
      </View>

      {/* Payment Details */}
      <View className="bg-white rounded-lg py-5 shadow-md mb-5 px-10    ">
        <Text className="text-center text-lg font-bold mb-5">
          PAYMENT SUCCESSFULLY
        </Text>

        <View className="flex-row justify-between mb-3 ">
          <Text className="text-base font-semibold text-gray-600">
            Invoice Code
          </Text>
          <Text className="text-base font-bold text-black">
            #{invoiceId || 1}
          </Text>
        </View>
        <View className="flex-row justify-between mb-3 ">
          <Text className="text-base font-semibold text-gray-600">
            Lot Code
          </Text>
          <Text className="text-base font-bold text-black">
            {" "}
            #{itemDetailBid.lotId}
          </Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-base font-semibold text-gray-600">
            Customer
          </Text>
          <Text className="text-base font-bold text-black">
            {user?.customerDTO.lastName} {user?.customerDTO.firstName}
          </Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-base font-semibold text-gray-600">
            Phone Number
          </Text>
          <Text className="text-base font-bold text-black">
            {user?.phoneNumber}
          </Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-base font-semibold text-gray-600">
            Name Product
          </Text>
          <Text className="text-base font-bold text-black text-right w-[70%]">
            {itemDetailBid.lotDTO.title}
          </Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-base font-semibold text-gray-600">
            Type of production
          </Text>
          <Text className="text-base font-bold text-black">Chưa cập nhật</Text>
        </View>

        <View className="h-px bg-gray-400 my-5" />

        <View className="flex-row justify-between">
          <Text className="text-base font-semibold text-gray-600">Total</Text>
          <Text className="text-lg font-bold text-black">
            {totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            }) || "0 VND"}
          </Text>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View className="flex-row justify-between absolute bottom-0 w-full p-4 bg-white">
        <TouchableOpacity
          className="flex-1 p-4 bg-gray-500 rounded-lg mr-2"
          onPress={handleHome}
        >
          <Text className="text-white text-center text-lg font-bold">HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 p-4 bg-blue-500 rounded-lg ml-2"
          onPress={handleInvoiceList}
        >
          <Text className="text-white text-center text-lg font-bold">
            INVOICE LIST
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentSuccess;
