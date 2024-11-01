import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { getTransactionsByCustomer } from "@/api/walletApi"; // Import the API function
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Transaction } from "@/app/types/wallet_type";

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false); // State to toggle view

  const userId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.id
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userId) {
        try {
          setLoading(true);
          const response = await getTransactionsByCustomer(userId);
          if (response && response.isSuccess) {
            setTransactions(response.data);
          } else {
            setError("Failed to load transactions.");
          }
        } catch (error) {
          setError("An error occurred while fetching transactions.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [userId]);

  if (loading) {
    return (
      <View className="items-center py-4">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Loading transactions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center py-4">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, 5);

  return (
    <View className="mb-4">
      <Text className="text-xl font-bold my-2">Transaction History</Text>
      {transactions.length === 0 ? (
        <Text className="text-gray-500">No transactions found.</Text>
      ) : (
        <>
          {displayedTransactions.map((transaction, index) => (
            <View
              key={index}
              className="p-4 mb-4 bg-gray-50 rounded-lg"
              style={{
                borderLeftWidth: 4,
                borderLeftColor: transaction.amount > 0 ? "#22c55e" : "#ef4444",
              }}
            >
              <View className="flex-row justify-between">
                <Text className="text-lg font-semibold">
                  {transaction.transactionType}
                </Text>
                <Text
                  className={`text-lg font-bold ${
                    transaction.amount > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {transaction.amount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text
                  className={`text-base font-bold uppercase ${
                    transaction.status === "Completed"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.status}
                </Text>
                <Text className="text-gray-600">
                  {new Date(transaction.transactionTime).toLocaleString(
                    "vi-VN"
                  )}
                </Text>
              </View>
            </View>
          ))}
          {transactions.length > 5 && (
            <TouchableOpacity
              onPress={() => setShowAll(!showAll)}
              className="mt-2 py-2 bg-blue-500 rounded-md mb-4"
            >
              <Text className="text-white font-semibold text-center">
                {showAll ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default TransactionHistory;
