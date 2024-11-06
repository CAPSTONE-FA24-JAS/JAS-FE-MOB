import React, { useState } from "react";
import { Linking, ScrollView, Text } from "react-native";
import { View } from "react-native";
import BalanceCard from "./component/BalanceCard";
import { Avatar, Card, RadioButton } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import DepositAmount from "./component/DepositAmount";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import { depositWallet } from "@/api/walletApi";
import LoadingOverlay from "@/components/LoadingOverlay";

const Deposit: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<string>("vnpay");
  const [amount, setAmount] = useState<number>(1000000); // Default amount set to 1000000
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  // Get wallet ID from Redux state
  const walletId = useSelector(
    (state: RootState) => state.profile.profile?.customerDTO?.walletDTO?.id
  );

  // Handle Deposit Now button press
  const handleDeposit = async () => {
    if (!walletId) {
      showErrorMessage("Wallet ID not found. Unable to proceed with deposit.");
      return;
    }

    // If amount is not set or less than or equal to 0, set it to the default value
    const depositAmount = amount <= 0 ? 1000000 : amount;

    setLoading(true); // Start loading
    try {
      const paymentLink = await depositWallet(walletId, depositAmount);
      if (paymentLink) {
        // Open the payment link in the browser
        Linking.openURL(paymentLink);
      }
    } catch (error) {
      console.error("Error during deposit:", error);
      showErrorMessage("Failed to initiate deposit. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <View className="flex-1">
      {/* Loading Overlay */}
      <LoadingOverlay visible={loading} />

      <ScrollView className="flex-1 p-2 bg-white">
        {/* Balance */}
        <BalanceCard />
        <DepositAmount setAmount={setAmount} />
        <View className="px-2">
          {/* Choose Payment Method */}
          <Text className="mb-2 text-lg font-semibold">
            2. CHOOSE PAYMENT METHOD
          </Text>

          <Text className="mb-4 font-semibold text-red-500">
            Note: After successful indirect payment, you need to take a
            screenshot of the transaction and upload it back to the JAS app.
          </Text>

          {/* VNPay Payment */}
          <Card className="mb-4 bg-white">
            <TouchableOpacity
              onPress={() => setSelectedPayment("vnpay")}
              className="flex-row items-center justify-between p-4">
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

      {/* Deposit Now button at the bottom */}
      <View className="absolute bottom-0 w-full p-4 bg-white border-t border-gray-300">
        <TouchableOpacity
          onPress={handleDeposit}
          className="py-3 bg-blue-500 rounded-lg">
          <Text className="text-lg font-bold text-center text-white">
            Deposit Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Deposit;
{
  /* MoMo Payment */
}
{
  /* <Card className="mb-4 bg-white">
          <TouchableOpacity
            onPress={() => setSelectedPayment("momo")}
            className="flex-row items-center justify-between p-4"
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
        </Card> */
}
