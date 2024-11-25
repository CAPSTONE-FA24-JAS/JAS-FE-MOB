import React, { useCallback } from "react";
import { View, Text, TextInput, Keyboard, Platform } from "react-native";

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
  // Xử lý format số tiền khi người dùng nhập
  const handleAmountChange = useCallback(
    (value: string) => {
      // Loại bỏ tất cả các ký tự không phải số
      const numericValue = value.replace(/\D/g, "");
      setAmount(numericValue);
      validateWithdraw();
    },
    [setAmount, validateWithdraw]
  );

  // Format số hiển thị với dấu phân cách hàng nghìn
  const getFormattedAmount = useCallback(() => {
    if (!amount || amount === "0") return "";
    return Number(amount).toLocaleString("vi-VN");
  }, [amount]);

  // Handle focus event
  const handleFocus = useCallback(() => {
    // Có thể thêm logic khi focus nếu cần
  }, []);

  // Handle blur event
  const handleBlur = useCallback(() => {
    validateWithdraw();
    // Chỉ tắt bàn phím trên Android
    if (Platform.OS === "android") {
      Keyboard.dismiss();
    }
  }, [validateWithdraw]);

  return (
    <View className="px-2 mb-4">
      <Text className="mb-4 text-lg font-bold">
        1. Select the amount to withdraw (VND)
      </Text>
      <TextInput
        value={getFormattedAmount()}
        onChangeText={handleAmountChange}
        placeholder="Enter withdraw amount"
        keyboardType="numeric"
        className="w-full p-2 text-lg border rounded-lg"
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="done"
        enablesReturnKeyAutomatically={true}
        onSubmitEditing={handleBlur}
      />
      {err ? <Text className="text-sm text-red-500">{err}</Text> : null}
    </View>
  );
};

export default WithdrawAmount;
