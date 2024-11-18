import React, { useState, useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { View } from "react-native";
import BalanceCard from "./component/BalanceCard";
import { Avatar, Card, RadioButton } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import WithdrawAmount from "./component/WithdrawAmount";
import { RequestNewWithdraw } from "@/api/walletApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

const Withdraw: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<string>("momo");
  const [amount, setAmount] = useState<string>("0");
  const [err, setErr] = useState<string>("");
  const [reload, setReload] = useState<boolean>(false); // Trạng thái reload

  const customerId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.id
  );

  const walletId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.walletId
  );

  const walletAmount = useSelector(
    (state: RootState) => state.profile.profile?.customerDTO?.walletDTO?.balance
  );

  // Fetch wallet details khi reload
  useEffect(() => {
    setErr("");
    setAmount("0");
  }, [reload]);

  const isDisabled = (): boolean => {
    if (
      !walletAmount ||
      Number(amount) <= 0 ||
      Number(amount) > walletAmount ||
      !selectedPayment
    ) {
      return true;
    }
    return false;
  };

  const validateWithdraw = (): string => {
    if (!walletAmount) return "Wallet balance is unavailable.";
    if (Number(amount) <= 0) return "Amount must be greater than 0.";
    if (Number(amount) > walletAmount)
      return "Amount must be less than your balance.";
    return ""; // Không có lỗi
  };

  const handleWithdraw = async () => {
    const errorMessage = validateWithdraw();
    setErr(errorMessage); // Cập nhật lỗi để hiển thị trên giao diện

    if (errorMessage || isDisabled()) {
      return; // Dừng nếu có lỗi
    }

    try {
      if (customerId && walletId && amount) {
        const response = await RequestNewWithdraw(
          customerId,
          walletId,
          Number(amount)
        );
        if (response && response.isSuccess) {
          showSuccessMessage("Withdraw successfully");
          setReload(!reload); // Reload lại trang
        } else {
          showErrorMessage("Unable to request withdraw.");
        }
      }
    } catch (error) {
      console.error("Error requesting withdraw:", error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-2">
        <BalanceCard />
        <WithdrawAmount
          amount={amount}
          setAmount={setAmount}
          err={err}
          validateWithdraw={validateWithdraw}
        />
        <View className="px-2">
          <Text className="mb-2 text-lg font-semibold">
            2. CHOOSE PAYMENT METHOD
          </Text>
          <Text className="mb-4 font-semibold text-red-500">
            Note: After completing indirect payment, take a screenshot of the
            transaction bill and upload it to JAS.
          </Text>

          {/* MoMo Payment */}
          <Card className="mb-4 bg-white">
            <TouchableOpacity
              onPress={() => setSelectedPayment("momo")}
              className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                <Avatar.Image
                  source={require("../../../assets/logo/MoMo_Logo.png")}
                  size={40}
                />
                <View className="ml-3">
                  <Text className="text-lg font-semibold">MoMo</Text>
                  <Text>MoMo Wallet Account</Text>
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
              className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                <Avatar.Image
                  source={require("../../../assets/logo/VNpay_Logo.png")}
                  size={40}
                />
                <View className="ml-3">
                  <Text className="text-lg font-semibold">VNPAY</Text>
                  <Text>VNPay Wallet Account</Text>
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

      {/* Nút Withdraw */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white">
        <TouchableOpacity
          onPress={handleWithdraw}
          disabled={isDisabled()}
          className={`p-4 rounded ${
            isDisabled() ? "bg-gray-300" : "bg-blue-500"
          }`}>
          <Text className="text-lg font-bold text-center text-white">
            WITHDRAW
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Withdraw;
