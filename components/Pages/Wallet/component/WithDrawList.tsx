import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card } from "react-native-paper";
import { getAllWithdraws, cancelWithdraw } from "@/api/walletApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useFocusEffect } from "@react-navigation/native";
import { Withdraws } from "@/app/types/wallet_type";

interface WithdrawListProps {
  containerStyle?: {
    flexGrow?: number;
    paddingBottom?: number;
  };
}

const WithDrawList: React.FC<WithdrawListProps> = ({
  containerStyle = { flexGrow: 1, paddingBottom: 80 },
}) => {
  const [withdraws, setWithdraws] = useState<Withdraws[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const customerId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.id
  );

  const fetchWithdraws = async () => {
    if (!customerId) return;

    try {
      const data = await getAllWithdraws(customerId);
      if (data) {
        setWithdraws(data);
      }
    } catch (error) {
      console.error("Error loading withdraws:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchWithdraws();
    }, [customerId])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWithdraws();
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Transfered": // Đã chuyển tiền thành công
        return "text-emerald-500";
      case "InProgress": // Đang xử lý
        return "text-amber-500";
      case "Canceled": // Đã hủy (nếu có)
        return "text-rose-500";
      case "Requested": // Mới yêu cầu
        return "text-sky-500";
      default:
        return "text-slate-500";
    }
  };

  const handleCancelWithdraw = useCallback(async (withdrawId: number) => {
    Alert.alert(
      "Cancel Withdrawal",
      "Are you sure you want to cancel this withdrawal request?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              if (customerId) {
                const response = await cancelWithdraw(withdrawId, customerId);
                if (response && response.isSuccess) {
                  showSuccessMessage("Withdrawal cancelled successfully");
                  fetchWithdraws(); // Refresh the list
                }
              } else {
                showErrorMessage("Customer ID is missing");
              }
            } catch (error) {
              console.error("Error cancelling withdraw:", error);
              showErrorMessage("Failed to cancel withdrawal");
            }
          },
        },
      ]
    );
  }, []);

  const renderWithdrawItem = ({ item }: { item: Withdraws }) => (
    <Card className="mx-2 mb-4">
      <Card.Content>
        <View className="flex-row justify-between mb-2">
          <Text className="text-lg font-semibold">
            {item.viewCreditCardDTO?.bankName
              ? item.viewCreditCardDTO.bankName
              : "Bank Unknown"}
          </Text>
          <Text className={`font-bold ${getStatusColor(item.status)}`}>
            {item.status}
          </Text>
        </View>

        <View className="mb-2">
          <Text className="text-gray-600">Account Holder</Text>
          <Text className="font-medium">
            {item.viewCreditCardDTO?.bankAccountHolder || "Not Available"}
          </Text>
        </View>

        <View className="mb-2">
          <Text className="text-gray-600">Account Number</Text>
          <Text className="font-medium">
            {item.viewCreditCardDTO?.bankCode || "Not Available"}
          </Text>
        </View>

        <View className="pt-2 border-t border-gray-200">
          <Text className="text-gray-600">Amount</Text>
          <Text className="text-lg font-bold">
            {item.amount.toLocaleString("en-US", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </View>

        {item.status.toUpperCase() === "Requested".toUpperCase() && (
          <TouchableOpacity
            onPress={() => handleCancelWithdraw(item.id)}
            className="px-4 py-2 mt-3 rounded-lg bg-rose-100">
            <Text className="text-base font-medium text-center text-rose-600">
              Cancel Request
            </Text>
          </TouchableOpacity>
        )}
      </Card.Content>
    </Card>
  );

  const ListEmptyComponent = () => {
    if (isLoading) {
      return (
        <View className="items-center justify-center flex-1">
          <Text>Loading withdraw history...</Text>
        </View>
      );
    }

    return (
      <View className="items-center justify-center flex-1">
        <Text className="text-lg text-gray-600">No withdraw history found</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={withdraws}
      renderItem={renderWithdrawItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={containerStyle}
      ListEmptyComponent={ListEmptyComponent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default WithDrawList;
