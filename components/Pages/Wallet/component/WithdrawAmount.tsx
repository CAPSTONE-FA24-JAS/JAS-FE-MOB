import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useSelector } from "react-redux";

interface WithdrawAmountProps {
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  err: string;
  validateWithdraw: () => void;
}

const WithdrawAmount: React.FC<WithdrawAmountProps> = ({
  amount,
  setAmount,
  err,
  validateWithdraw,
}) => {
  console.log("errr log", err);

  return (
    <View className="px-2 mb-4">
      <Text className="mb-4 text-lg font-bold">
        1. Select the amount to withdraw (VND)
      </Text>
      <TextInput
        value={Number(amount).toLocaleString("vi-VN")}
        onChangeText={(value) => {
          setAmount(value.replace(/\D/g, ""));
          validateWithdraw();
        }} // Allow only numbers
        placeholder="Enter withdraw amount"
        keyboardType="numeric"
        className="w-full p-2 text-lg border rounded-lg"
      />
      {err ? <Text className="text-sm text-red-500">{err}</Text> : null}
    </View>
  );
};

export default WithdrawAmount;
