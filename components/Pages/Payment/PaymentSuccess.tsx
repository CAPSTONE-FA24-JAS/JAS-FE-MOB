import { MyBidData } from "@/app/types/bid_type";
import { RootState } from "@/redux/store";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Sử dụng icon checkmark
import { CommonActions, RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "DrawerLayout", params: { screen: "Auctions" } }],
      })
    );
  };
  const handleInvoiceList = () => {
    // Navigate to 'InvoiceList' through 'Account' stack
    navigation.navigate("InvoiceList");
  };

  // Calculate the total price

  return (
    <View className="flex-1 pt-20 bg-white ">
      {/* Payment Success Title */}
      {/* <Text className="mb-5 text-2xl font-bold text-center">
        Payment Success
      </Text> */}

      {/* Success Icon */}
      <View className="items-center justify-center mb-5">
        <MaterialCommunityIcons name="check-circle" size={100} color="green" />
      </View>

      {/* Payment Details */}
      <View className="px-10 py-5 mb-5 bg-white rounded-lg shadow-md ">
        <Text className="mb-5 text-lg font-bold text-center">
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

        <View className="h-px my-5 bg-gray-400" />

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
      <View className="absolute bottom-0 flex-row justify-between w-full p-4 bg-white">
        <TouchableOpacity
          className="flex-1 p-4 mr-2 bg-gray-500 rounded-lg"
          onPress={handleHome}>
          <Text className="text-lg font-bold text-center text-white">HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 p-4 ml-2 bg-blue-500 rounded-lg"
          onPress={handleInvoiceList}>
          <Text className="text-lg font-bold text-center text-white">
            INVOICE LIST
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentSuccess;
