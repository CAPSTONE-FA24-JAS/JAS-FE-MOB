import React from "react";
import { View, Text } from "react-native";

const TransactionHistory: React.FC = () => {
  const transactions = [
    {
      id: 1,
      type: "Product Deposit",
      amount: "-10.000.000 VND",
      date: "11:25 02/03/2024",
      status: "Successful",
      color: "green",
    },
    {
      id: 2,
      type: "Buy Diamond",
      amount: "-500.000.000 VND",
      date: "11:25 02/03/2024",
      status: "Successful",
      color: "red",
    },
    {
      id: 3,
      type: "Refund Deposit",
      amount: "+10.000.000 VND",
      date: "11:25 02/03/2024",
      status: "Successful",
      color: "green",
    },
    {
      id: 4,
      type: "Buy Gold Ring 24K",
      amount: "-30.000.000 VND",
      date: "11:25 02/03/2024",
      status: "Successful",
      color: "red",
    },
  ];

  return (
    <View className="mb-4">
      <Text className="text-xl font-bold my-2">Transaction History</Text>
      {transactions.map((transaction) => (
        <View
          key={transaction.id}
          className="p-4 mb-4 bg-gray-50 rounded-lg"
          style={{
            borderLeftWidth: 4,
            borderLeftColor:
              transaction.color === "green" ? "#22c55e" : "#ef4444",
          }} // Set inline color
        >
          <View className="flex-row justify-between">
            <Text className="text-lg font-semibold">{transaction.type}</Text>
            <Text
              className={`text-lg font-bold ${
                transaction.color === "green"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {transaction.amount}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text
              className={`text-base font-bold uppercase ${
                transaction.color === "green"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {transaction.status}
            </Text>
            <Text className="text-gray-600">{transaction.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default TransactionHistory;
