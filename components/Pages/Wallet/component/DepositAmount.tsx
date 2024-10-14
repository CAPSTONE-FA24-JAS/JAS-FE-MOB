import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

const DepositAmount: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000000);
  const amounts = [1000000, 2000000, 5000000]; // Predefined amounts as numbers

  return (
    <View className="px-2 mb-4">
      <Text className="text-lg font-bold mb-4">
        1. Select the amount to deposit (VND)
      </Text>
      <View className="flex-row justify-around mb-4">
        {amounts.map((amount) => (
          <TouchableOpacity
            key={amount}
            onPress={() => setSelectedAmount(amount)}
            className={`flex-1 items-center justify-center py-2 border rounded-lg mx-1 ${
              selectedAmount === amount ? "bg-black" : "bg-white"
            }`}
          >
            <Text
              className={`text-lg font-bold ${
                selectedAmount === amount ? "text-white" : "text-black"
              }`}
            >
              {amount.toLocaleString("vi-VN")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        value={selectedAmount.toLocaleString("vi-VN")}
        onChangeText={(value) => {
          const numericValue = Number(value.replace(/\D/g, ""));
          setSelectedAmount(numericValue);
        }}
        placeholder="Enter custom amount"
        keyboardType="numeric"
        className="w-full border rounded-lg p-2 text-lg"
      />
    </View>
  );
};

export default DepositAmount;
