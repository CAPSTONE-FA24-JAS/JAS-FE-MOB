import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";

const WithdrawAmount: React.FC = () => {
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);

  return (
    <View className="px-2 mb-4">
      <Text className="text-lg font-bold mb-4">
        1. Select the amount to withdraw (VND)
      </Text>
      <TextInput
        value={withdrawAmount.toLocaleString("vi-VN")}
        onChangeText={(value) =>
          setWithdrawAmount(Number(value.replace(/\D/g, "")))
        } // Allow only numbers
        placeholder="Enter withdraw amount"
        keyboardType="numeric"
        className="w-full border rounded-lg p-2 text-lg"
      />
    </View>
  );
};

export default WithdrawAmount;
