import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Sử dụng icon checkmark
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
// Define the types for navigation routes
type RootStackParamList = {
  HomePage: undefined;
  Account: { screen: "InvoiceList" };
};

const PaymentSuccess: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const handleHome = () => {
    navigation.navigate("HomePage");
  };
  const handleInvoiceList = () => {
    // Navigate to 'InvoiceList' through 'Account' stack
    navigation.navigate("Account", { screen: "InvoiceList" as const });
  };
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

        <View className="h-px bg-gray-400 my-5" />

        <View className="flex-row justify-between">
          <Text className="text-base font-semibold text-gray-600">Total</Text>
          <Text className="text-lg font-bold text-black">35.200.000 VND</Text>
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
