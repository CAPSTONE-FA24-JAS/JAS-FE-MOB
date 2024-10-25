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

const BalanceCard: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();
  const accountId = useSelector(
    (state: RootState) => state.auth.userResponse?.id
  );
  const haveWallet = useSelector(
    (state: RootState) => state.profile.profile?.customerDTO?.walletDTO?.id
  );

  // Fetch the wallet balance inside BalanceCard
  useEffect(() => {
    if (!haveWallet && accountId !== undefined) {
      // Fetch profile to get wallet info if not available
      dispatch(fetchProfile(accountId));
    } else if (haveWallet) {
      // Fetch wallet balance
      getWalletBalance(haveWallet);
    }
  }, [dispatch, accountId, haveWallet]);

  const getWalletBalance = async (walletId: number) => {
    try {
      const response = await checkWalletBalance(walletId);
      if (response && response.isSuccess) {
        setBalance(response.data.balance);
        showSuccessMessage("Wallet balance retrieved successfully.");
      }
    } catch (error) {
      showErrorMessage("Failed to retrieve wallet balance.");
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
              onPress={() => setIsBalanceVisible(!isBalanceVisible)}
              className="mr-6 mt-10"
            >
              <Icon
                name={isBalanceVisible ? "visibility" : "visibility-off"}
                size={24}
              />
            </TouchableOpacity>
          )}
        />
        <Card.Content>
          <Text className="text-3xl font-bold text-gray-800">
            {isBalanceVisible
              ? `${
                  Number(balance).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }) || "0"
                }`
              : "******** đ"}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

export default BalanceCard;
