import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { RadioButton, Appbar, Card, Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Material Icons
import BalanceCard from "../Wallet/component/BalanceCard";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import {
  paymentInvoiceByVnPay,
  paymentInvoiceByWallet,
} from "@/api/invoiceApi";
import { Linking } from "react-native";

// Define the types for navigation routes
type RootStackParamList = {
  PaymentUpload: undefined;
  PaymentSuccess: undefined;
  Payment: { totalPrice: number; invoiceId: number };
};

const Payment: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Payment">>();
  const { totalPrice, invoiceId } = route.params;

  const walletId = useSelector(
    (state: RootState) => state.profile.profile?.customerDTO?.walletDTO?.id
  );
  const [selectedPayment, setSelectedPayment] = useState<string>("wallet");
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(false); // State to handle balance visibility
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // State to handle processing

  console.log("Slected Payment:", selectedPayment);

  const handlePayment = async () => {
    if (selectedPayment === "wallet") {
      // Ensure walletId exists
      if (!walletId) {
        showErrorMessage("Wallet not found.");
        return;
      }

      setIsProcessing(true);

      try {
        console.log(
          "Payment initiated by wallet:",
          walletId,
          totalPrice,
          invoiceId
        );

        const response = await paymentInvoiceByWallet(
          walletId,
          totalPrice,
          invoiceId
        );
        console.log("Payment response:", response);

        if (response?.isSuccess) {
          showSuccessMessage(response.message || "Payment successful.");
          navigation.navigate("PaymentSuccess");
        } else {
          showErrorMessage(response?.message || "Payment failed.");
        }
      } catch (error) {
        showErrorMessage("An error occurred during payment.");
        console.error("Payment Error:", error);
      } finally {
        setIsProcessing(false);
      }
    } else if (selectedPayment === "vnpay") {
      setIsProcessing(true);

      try {
        const response = await paymentInvoiceByVnPay(invoiceId, totalPrice);

        if (response?.isSuccess) {
          showSuccessMessage(
            response.message || "Payment initiated successfully."
          );

          const paymentUrl = response.data; // Lấy URL từ phản hồi

          if (paymentUrl) {
            // Kiểm tra xem URL có hợp lệ không
            const supported = await Linking.canOpenURL(paymentUrl);
            if (supported) {
              // Mở URL trong trình duyệt
              await Linking.openURL(paymentUrl);
            } else {
              showErrorMessage("Failed to open payment URL.");
            }
          } else {
            showErrorMessage("Invalid payment URL.");
          }

          // Có thể điều hướng đến một màn hình khác sau khi mở URL nếu cần
          // Ví dụ: navigation.navigate("PaymentUpload");
        } else {
          showErrorMessage(
            response?.message || "Failed to initiate VNPAY payment."
          );
        }
      } catch (error) {
        showErrorMessage("An error occurred during VNPAY payment.");
        console.error("VNPAY Payment Error:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Balance */}
          <BalanceCard />

          {/* Choose Payment Method */}
          <Text className="text-lg font-semibold mb-2">
            CHOOSE PAYMENT METHOD
          </Text>

          <RadioButton.Group
            onValueChange={(newValue) => setSelectedPayment(newValue)}
            value={selectedPayment}
          >
            {/* Direct Payment */}
            <Text className="text-base font-medium mb-2 text-gray-700">
              Thanh toán trực tiếp
            </Text>

            <Card className="mb-4 bg-white">
              <TouchableOpacity className="flex-row justify-between items-center p-4">
                <View className="flex-row items-center">
                  <Avatar.Icon icon="wallet" size={40} />
                  <View className="ml-3">
                    <Text className="text-lg font-semibold">MY WALLET</Text>
                    <Text>Thanh toán trực tiếp ví của tôi</Text>
                  </View>
                </View>
                <RadioButton value="wallet" />
              </TouchableOpacity>
            </Card>

            {/* Indirect Payment */}
            <Text className="text-base font-medium mb-2 text-gray-700">
              Thanh toán gián tiếp
            </Text>
            <Text className="text-red-500  font-semibold mb-4">
              Note: Sau khi thanh toán gián tiếp thành công, bạn cần chụp màn
              hình bill chuyển khoản và upload lên lại app JAS.
            </Text>

            {/* VNPAY Payment */}
            <Card className="mb-4 bg-white">
              <TouchableOpacity className="flex-row justify-between items-center p-4">
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
                <RadioButton value="vnpay" />
              </TouchableOpacity>
            </Card>
          </RadioButton.Group>
        </View>
      </ScrollView>

      {/* Payment Button at the bottom */}
      <View className="absolute bottom-0 w-full p-4 bg-white">
        <TouchableOpacity
          className={`p-3 rounded bg-blue-500 ${
            isProcessing ? "bg-blue-300" : "bg-blue-500"
          }`}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-bold">
              PAYMENT
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payment;
