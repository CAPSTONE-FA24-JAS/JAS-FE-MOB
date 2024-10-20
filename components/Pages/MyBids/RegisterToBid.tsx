import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { Button, Checkbox, Modal, IconButton } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import BalanceCard from "../Wallet/component/BalanceCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { checkWalletBalance } from "@/api/walletApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { LotDetail } from "@/app/types/lot_type";
import { registerToBid } from "@/api/lotAPI";

const RegisterToBid = () => {
  const route = useRoute();
  const lotDetail = route.params as LotDetail;
  console.log("lotDetail", lotDetail);

  const navigation = useNavigation();
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [checkedAge, setCheckedAge] = useState(false);
  const [balance, setBalance] = useState<string | null>(null); // Store balance here
  const userId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.id
  );
  const haveWallet = useSelector(
    (state: RootState) => state.profile.profile?.customerDTO?.walletDTO?.id
  );

  console.log("accountIdNe", userId);
  console.log("balanceNe", balance);
  console.log("haveWalletNE", haveWallet);

  useEffect(() => {
    if (haveWallet) {
      // Fetch wallet balance if walletId is available
      getWalletBalance(haveWallet);
    }
  }, [haveWallet]);

  // Function to fetch wallet balance
  const getWalletBalance = async (walletId: number) => {
    try {
      const response = await checkWalletBalance(walletId);
      if (response && response.isSuccess) {
        setBalance(response.data.balance); // Set balance
        showSuccessMessage("Check Wallet balance retrieved successfully.");
      }
    } catch (error) {
      showErrorMessage("Failed to check retrieve wallet balance.");
    }
  };

  // Hàm xử lý đăng ký đấu giá
  const handleRegisterToBid = async () => {
    if (!userId) {
      showErrorMessage("User ID is not available.");
      return;
    }

    if (balance && parseInt(balance) < lotDetail.deposit) {
      showErrorMessage("Insufficient balance.");
      return;
    }

    try {
      await registerToBid(lotDetail.deposit, userId, lotDetail.id);
      showSuccessMessage("Register customer to lot successfully.");
      navigation.goBack(); // Quay lại màn hình trước đó sau khi đăng ký thành công
    } catch (error) {
      showErrorMessage("Failed to register to bid.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Hiển thị số dư hiện tại */}
      <BalanceCard balance={balance} />

      {/* Thông tin đặt cọc */}
      <View className="border rounded-lg p-4">
        <Text className="text-lg font-bold mb-4">DEPOSIT INFORMATION</Text>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold text-gray-500">
            Auction Name
          </Text>
          <Text className="text-base w-[60%] text-gray-700 font-semibold">
            {lotDetail?.auction?.name || "N/A"}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold text-gray-500">
            Lot Name
          </Text>
          <Text className="text-base w-[60%] text-gray-700 font-semibold">
            {lotDetail?.jewelry?.name || "N/A"}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold text-gray-500">
            Deposit Fee
          </Text>
          <Text className="text-base w-[60%] text-gray-700 font-semibold">
            {lotDetail?.deposit.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            }) || 0}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold text-gray-500">
            New Balance
          </Text>
          <Text className="text-base w-[60%] text-gray-700 font-semibold">
            {balance && parseInt(balance) > lotDetail.deposit
              ? `${parseInt(balance) - lotDetail.deposit} VND`
              : "N/A Or Insufficient balance"}
          </Text>
        </View>

        <View className="border-t my-2" />

        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold text-gray-500">
            Transaction Fees
          </Text>
          <Text className="text-base w-[60%] text-gray-700 font-semibold">
            Free
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold text-gray-500">
            Transaction Code
          </Text>
          <Text className="text-base w-[60%] text-gray-700 font-semibold">
            #1234567
          </Text>
        </View>
      </View>

      {/* Điều khoản và điều kiện */}
      <View className="mt-4">
        <View className="flex-row items-center mb-2">
          <Checkbox
            status={checkedTerms ? "checked" : "unchecked"}
            onPress={() => setCheckedTerms(!checkedTerms)}
          />
          <Text className="text-base ml-2">
            I have read and agree to the{" "}
            <Text className="text-blue-500">Terms of Use</Text> and{" "}
            <Text className="text-blue-500">Privacy Policy</Text>.
          </Text>
        </View>

        <View className="flex-row items-center mb-4">
          <Checkbox
            status={checkedAge ? "checked" : "unchecked"}
            onPress={() => setCheckedAge(!checkedAge)}
          />
          <Text className="text-base ml-2">I am 18 years of age or older</Text>
        </View>
      </View>

      <TouchableOpacity
        className="py-3 bg-blue-500 rounded-sm"
        onPress={handleRegisterToBid}
        disabled={!checkedTerms || !checkedAge}
      >
        <Text className="font-semibold text-center text-white">
          REGISTER TO BID
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterToBid;
