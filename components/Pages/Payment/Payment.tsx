import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { RadioButton, Appbar, Card, Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Material Icons

// Define the types for navigation routes
type RootStackParamList = {
  PaymentUpload: undefined;
  PaymentSuccess: undefined;
};

const Payment: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [selectedPayment, setSelectedPayment] = useState<string>("wallet");
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(false); // State to handle balance visibility

  const handlePayment = () => {
    if (selectedPayment === "wallet") {
      navigation.navigate("PaymentSuccess"); // Navigate to PaymentSuccess if My Wallet is selected
    } else {
      navigation.navigate("PaymentUpload"); // Navigate to PaymentUpload for MoMo or VNPay
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Balance */}
          <Card className="mb-4 bg-white">
            <Card.Title
              title="Balance"
              left={(props) => <Avatar.Icon {...props} icon="credit-card" />}
              right={(props) => (
                <TouchableOpacity
                  onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                  className="mr-6 mt-10"
                >
                  <Icon
                    {...props}
                    name={isBalanceVisible ? "visibility" : "visibility-off"}
                    size={24}
                  />
                </TouchableOpacity>
              )}
            />
            <Card.Content>
              <Text className="text-3xl font-bold text-gray-800">
                {isBalanceVisible ? "55.000.000 VND" : "******** VND"}
              </Text>
            </Card.Content>
          </Card>

          {/* Choose Payment Method */}
          <Text className="text-lg font-semibold mb-2">
            CHOOSE PAYMENT METHOD
          </Text>

          {/* Direct Payment */}
          <Text className="text-base font-medium mb-2 text-gray-700">
            Thanh toán trực tiếp
          </Text>

          <Card className="mb-4 bg-white">
            <TouchableOpacity
              onPress={() => setSelectedPayment("wallet")}
              className="flex-row justify-between items-center p-4"
            >
              <View className="flex-row items-center">
                <Avatar.Icon icon="wallet" size={40} />
                <View className="ml-3">
                  <Text className="text-lg font-semibold">MY WALLET</Text>
                  <Text>Thanh toán trực tiếp ví của tôi</Text>
                </View>
              </View>
              <RadioButton
                value="wallet"
                status={selectedPayment === "wallet" ? "checked" : "unchecked"}
              />
            </TouchableOpacity>
          </Card>

          {/* Indirect Payment */}
          <Text className="text-base font-medium mb-2 text-gray-700">
            Thanh toán gián tiếp
          </Text>
          <Text className="text-red-500 mb-2 font-semibold mb-4">
            Note: Sau khi thanh toán gián tiếp thành công, bạn cần chụp màn hình
            bill chuyển khoản và upload lên lại app JAS.
          </Text>

          {/* MoMo Payment */}
          <Card className="mb-4 bg-white">
            <TouchableOpacity
              onPress={() => setSelectedPayment("momo")}
              className="flex-row justify-between items-center p-4"
            >
              <View className="flex-row items-center">
                <Avatar.Image
                  source={require("../../../assets/logo/MoMo_Logo.png")}
                  size={40}
                />
                <View className="ml-3">
                  <Text className="text-lg font-semibold">MoMo</Text>
                  <Text>Tài khoản ví MoMo</Text>
                </View>
              </View>
              <RadioButton
                value="momo"
                status={selectedPayment === "momo" ? "checked" : "unchecked"}
              />
            </TouchableOpacity>
          </Card>

          {/* VNPay Payment */}
          <Card className="mb-4 bg-white">
            <TouchableOpacity
              onPress={() => setSelectedPayment("vnpay")}
              className="flex-row justify-between items-center p-4"
            >
              <View className="flex-row items-center">
                <Avatar.Image
                  source={require("../../../assets/logo/VNpay_Logo.png")}
                  size={40}
                />
                <View className="ml-3">
                  <Text className="text-lg font-semibold">VNPAY</Text>
                  <Text>Tài khoản ví VNPAY</Text>
                </View>
              </View>
              <RadioButton
                value="vnpay"
                status={selectedPayment === "vnpay" ? "checked" : "unchecked"}
              />
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>

      {/* Payment Button at the bottom */}
      <View className="absolute bottom-0 w-full p-4 bg-white">
        <TouchableOpacity
          className="p-3 rounded bg-blue-500"
          onPress={handlePayment}
        >
          <Text className="text-white text-center text-lg font-bold">
            PAYMENT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payment;
