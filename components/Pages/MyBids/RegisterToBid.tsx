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

type RootStackParamList = {
  [x: string]: any;
};

const RegisterToBid = () => {
  const route = useRoute();
  const lotDetail = route.params as LotDetail;
  console.log("lotDetail", lotDetail);

  const navigation = useNavigation<RootStackParamList>();
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [checkedAge, setCheckedAge] = useState(false);
  const [balance, setBalance] = useState<string | null>(null); // Store balance here
  const userId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.id
  );
  const haveWallet = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.walletDTO?.id
  );

  console.log("accountIdNe", userId);
  console.log("balanceNe", balance);
  console.log("haveWalletNE", haveWallet);

  useEffect(() => {
    const fetchData = async () => {
      if (haveWallet) {
        await getWalletBalance(haveWallet); // Fetch balance
      }
    };

    fetchData();
  }, [haveWallet]);

  const getWalletBalance = async (walletId: number) => {
    try {
      const response = await checkWalletBalance(walletId);
      if (response && response.isSuccess) {
        setBalance(response.data.balance);
        showSuccessMessage("Check Wallet balance retrieved successfully.");
      } else {
        setBalance(null); // Set null if response fails
      }
    } catch (error) {
      showErrorMessage("Failed to retrieve wallet balance.");
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
      navigation.navigate("RisingBidPage", { itemId: 41 }); // fix cứng ở đây
    } catch (error) {
      showErrorMessage("Failed to register to bid.");
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {/* Hiển thị số dư hiện tại */}

      <BalanceCard />

      {/* Thông tin đặt cọc */}
      <View className="p-4 border rounded-lg">
        <Text className="mb-4 text-lg font-bold">DEPOSIT INFORMATION</Text>

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

        <View className="my-2 border-t" />

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
          <Text className="ml-2 text-base">
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
          <Text className="ml-2 text-base">I am 18 years of age or older</Text>
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
