import React, { useState, useCallback } from "react";
import { ScrollView, Text } from "react-native";
import { View } from "react-native";
import BalanceCard from "./component/BalanceCard";
import { Card } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import WithdrawAmount from "./component/WithdrawAmount";
import { RequestNewWithdraw } from "@/api/walletApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { BankAccountInfo, getAllCardByCustomerId } from "@/api/cardApi";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";

const Withdraw: React.FC = () => {
  const [amount, setAmount] = useState<string>("0");
  const [err, setErr] = useState<string>("");
  const [existingBankAccounts, setExistingBankAccounts] = useState<
    BankAccountInfo[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigation = useNavigation<any>();
  const customerId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.id
  );

  const walletId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.walletId
  );

  const walletAmount = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.walletDTO.balance
  );

  useFocusEffect(
    useCallback(() => {
      setErr("");
      setAmount("0");
      setIsLoading(true);

      if (customerId) {
        getAllCardByCustomerId(customerId)
          .then((data) => {
            setExistingBankAccounts(data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching bank accounts:", error);
            setIsLoading(false);
          });
      }
    }, [
      customerId,
      getAllCardByCustomerId,
      setExistingBankAccounts,
      walletAmount,
    ]) // Dependencies
  );

  const isDisabled = (): boolean => {
    console.log(amount, walletAmount);

    // Disable if no bank accounts, no wallet amount, invalid amount, or no payment method
    if (
      existingBankAccounts.length == 0 ||
      !walletAmount ||
      Number(amount) <= 0 ||
      Number(amount) > walletAmount
    ) {
      return true;
    }
    return false;
  };

  const validateWithdraw = (): string => {
    if (existingBankAccounts.length === 0)
      return "Please add a bank account first";
    if (!walletAmount) return "Wallet balance is unavailable.";
    if (Number(amount) <= 0) return "Amount must be greater than 0.";
    if (Number(amount) > walletAmount)
      return "Amount must be less than your balance.";
    return ""; // No errors
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
          navigation.navigate("Wallet");
        } else {
          showErrorMessage("Unable to request withdraw.");
        }
      }
    } catch (error) {
      console.error("Error requesting withdraw:", error);
    }
  };

  const handleAddBankAccount = () => {
    navigation.navigate("AddBankAccount");
  };

  const renderBankAccountSection = () => {
    if (isLoading) {
      return <Text>Loading bank accounts...</Text>;
    }

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
        {existingBankAccounts.map((account, index) => (
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
        {renderBankAccountSection()}
      </ScrollView>

      {/* Withdraw Button */}
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
