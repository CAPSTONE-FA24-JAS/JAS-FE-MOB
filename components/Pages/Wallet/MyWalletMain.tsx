import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import BalanceCard from "./component/BalanceCard";
import TransactionButton from "./component/TransactionButton";
import InfoCard from "./component/InfoCard";
import TransactionHistory from "./component/TransactionHistory";
import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "@/redux/store";
import { Text } from "react-native";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { checkWalletBalance, createWallet } from "@/api/walletApi";
import { fetchProfile } from "@/redux/slices/profileSlice";

const MyWalletMain: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<string | null>(null); // Store balance here

  const dispatch = useDispatch<typeof store.dispatch>();
  const accountId = useSelector(
    (state: RootState) => state.auth.userResponse?.id
  );
  const userId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.id
  );
  const haveWallet = useSelector(
    (state: RootState) => state.profile.profile?.customerDTO?.walletDTO?.id
  );

  console.log("haveWallet", haveWallet);

  // Reload wallet status by fetching user profile
  useEffect(() => {
    if (!haveWallet && accountId !== undefined) {
      dispatch(fetchProfile(accountId));
    } else if (haveWallet) {
      // Fetch wallet balance if walletId is available
      getWalletBalance(haveWallet);
    }
  }, [dispatch, accountId, haveWallet]);

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

  const handleCreateWallet = async () => {
    if (!userId) {
      showErrorMessage("User ID not found. Unable to create wallet.");
      return;
    }

    try {
      setLoading(true);
      const response = await createWallet(userId);
      console.log("responseCreateWallet", response);

      if (response && response.isSuccess) {
        showSuccessMessage("Wallet created successfully.");
        if (accountId) dispatch(fetchProfile(accountId));
        // Update the walletId in Redux
        // dispatch(updateUserWalletId(response.data.walletId)); // Assuming response contains walletId
      }
    } catch (error) {
      showErrorMessage("Failed to create wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!haveWallet ? (
        <View className="flex-1 bg-white justify-center pb-10 px-6 items-center">
          <Text className="text-lg text-center text-gray-500">
            You don't have a wallet yet. Do you want to create your Wallet?
            Click the button below!
          </Text>
          <TouchableOpacity
            onPress={handleCreateWallet}
            className={`bg-blue-500 py-2 px-4 mt-4 rounded-lg ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-white font-bold text-xl uppercase">
                Create Wallet
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="bg-white flex-1 p-2">
          {/* Balance */}
          <BalanceCard balance={balance} />
          {/* Transaction Buttons */}

          {/* Transaction Buttons */}
          <View className="flex-row justify-around mb-4">
            <TransactionButton title="Deposit" icon="deposit" />
            <TransactionButton title="Withdraw" icon="withdraw" />
          </View>

          {/* Info Cards */}
          <InfoCard />

          {/* Transaction History */}
          <TransactionHistory />
        </ScrollView>
      )}
    </>
  );
};

export default MyWalletMain;
