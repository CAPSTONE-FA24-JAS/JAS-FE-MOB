import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Card, Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { checkWalletBalance } from "@/api/walletApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { fetchProfile } from "@/redux/slices/profileSlice";
import { WalletDto } from "@/app/types/profilte_type";

const BalanceCard: React.FC = () => {
  const [balanceData, setBalanceData] = useState<WalletDto | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();
  const accountId = useSelector(
    (state: RootState) => state.auth.userResponse?.id
  );
  const haveWallet = useSelector(
    (state: RootState) => state.profile.profile?.customerDTO?.walletDTO?.id
  );

  useEffect(() => {
    if (!haveWallet && accountId !== undefined) {
      dispatch(fetchProfile(accountId));
    } else if (haveWallet) {
      getWalletBalance(haveWallet);
    }
  }, [dispatch, accountId, haveWallet]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const getWalletBalance = async (walletId: number) => {
    try {
      const response = await checkWalletBalance(walletId);
      if (response && response.isSuccess) {
        setBalanceData(response.data);
        showSuccessMessage("Wallet balance retrieved successfully.");
      }
    } catch (error) {
      showErrorMessage("Failed to retrieve wallet balance.");
    }
  };

  const handleViewBalance = () => {
    setIsBalanceVisible(!isBalanceVisible);
    if (haveWallet) {
      getWalletBalance(haveWallet);
    }
  };

  return (
    <View className="p-2">
      <Card className="mb-4 bg-white">
        <Card.Title
          title="Balance"
          left={(props) => <Avatar.Icon {...props} icon="credit-card" />}
          right={(props) => (
            <TouchableOpacity
              onPress={() => handleViewBalance()}
              className="mt-10 mr-6">
              <Icon
                name={isBalanceVisible ? "visibility" : "visibility-off"}
                size={24}
              />
            </TouchableOpacity>
          )}
        />
        <Card.Content>
          <View className="space-y-2">
            <View>
              <Text className="text-sm text-gray-600">Total Balance</Text>
              <Text className="text-3xl font-bold text-gray-800">
                {isBalanceVisible
                  ? formatCurrency(balanceData?.balance || 0)
                  : "******** đ"}
              </Text>
            </View>

            <View className="flex-row justify-between pt-2">
              <View>
                <Text className="text-sm text-gray-600">Available</Text>
                <Text className="text-lg font-semibold text-green-600">
                  {isBalanceVisible
                    ? formatCurrency(balanceData?.availableBalance || 0)
                    : "******** đ"}
                </Text>
              </View>

              <View>
                <Text className="text-sm text-gray-600">Frozen</Text>
                <Text className="text-lg font-semibold text-blue-600">
                  {isBalanceVisible
                    ? formatCurrency(balanceData?.frozenBalance || 0)
                    : "******** đ"}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default BalanceCard;
