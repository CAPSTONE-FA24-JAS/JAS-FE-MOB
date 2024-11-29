import { BankAccountInfo, getAllCardByCustomerId } from "@/api/cardApi";
import { checkWalletBalance, RequestNewWithdraw } from "@/api/walletApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { RootState } from "@/redux/store";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Card } from "react-native-paper";
import { useSelector } from "react-redux";
import BalanceCard from "./component/BalanceCard";
import WithdrawAmount from "./component/WithdrawAmount";
import WithDrawList from "./component/WithDrawList";

const Withdraw: React.FC = () => {
  const [amount, setAmount] = useState<string>("0");
  const [err, setErr] = useState<string>("");
  const [existingBankAccounts, setExistingBankAccounts] = useState<
    BankAccountInfo[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const navigation = useNavigation<any>();
  const customerId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.id
  );
  const walletId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.walletId
  );

  const fetchData = async () => {
    setIsLoading(true);
    setErr("");
    setAmount("0");

    try {
      // Fetch both wallet balance and bank accounts in parallel
      const [balanceResponse, bankAccountsResponse] = await Promise.all([
        walletId
          ? checkWalletBalance(walletId)
          : Promise.resolve({ isSuccess: false, data: { balance: 0 } }),
        customerId ? getAllCardByCustomerId(customerId) : Promise.resolve([]),
      ]);

      if (balanceResponse && balanceResponse.isSuccess) {
        setWalletBalance(balanceResponse.data.balance);
      }

      setExistingBankAccounts(bankAccountsResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
      showErrorMessage("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [customerId, walletId])
  );

  const isDisabled = (): boolean => {
    return (
      existingBankAccounts.length === 0 ||
      Number(amount) <= 0 ||
      Number(amount) > walletBalance
    );
  };

  const validateWithdraw = (): string => {
    if (existingBankAccounts.length === 0)
      return "Please add a bank account first";
    if (Number(amount) <= 0) return "Amount must be greater than 0.";
    if (Number(amount) > walletBalance)
      return "Amount must be less than your balance.";
    return "";
  };

  const handleWithdraw = async () => {
    const errorMessage = validateWithdraw();
    setErr(errorMessage);

    if (errorMessage || isDisabled()) {
      return;
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
          setAmount("0");
        } else {
          showErrorMessage("Unable to request withdraw.");
        }
      }
    } catch (error) {
      console.error("Error requesting withdraw:", error);
      showErrorMessage("Failed to process withdrawal. Please try again.");
    }
  };

  const handleAddBankAccount = () => {
    navigation.navigate("AddBankAccount");
  };

  const renderBankAccountSection = () => {
    if (existingBankAccounts.length === 0) {
      return (
        <View className="items-center px-2 mt-4">
          <Text className="mb-2 text-lg font-semibold text-center">
            No Bank Account Added
          </Text>
          <TouchableOpacity
            onPress={handleAddBankAccount}
            className="p-3 bg-blue-500 rounded-lg">
            <Text className="font-semibold text-white">Add Bank Account</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="px-2">
        <Text className="mb-2 text-lg font-semibold">2. BANK ACCOUNT</Text>
        {existingBankAccounts &&
          existingBankAccounts.map((account, index) => (
            <Card key={index} className="mb-2">
              <Card.Content className="flex-row items-center">
                <View className="ml-2">
                  <Text className="font-semibold">{account.bankName}</Text>
                  <Text>{account.bankAccountHolder}</Text>
                  <Text>{account.bankCode}</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <BalanceCard />

      <View className="flex-grow p-2">
        <WithdrawAmount
          amount={amount}
          setAmount={setAmount}
          err={err}
          validateWithdraw={validateWithdraw}
        />
        {renderBankAccountSection()}
      </View>
      {existingBankAccounts ? <WithDrawList /> : ""}

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
