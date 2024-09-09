import React from "react";
import { View, Text } from "react-native";

export interface FinancialProofItem {
  id: string;
  status: "Approved" | "Reject";
  createDate: string;
  expireDate?: string;
  reason?: string;
}

const ItemFinanceProof = ({ item }: { item: FinancialProofItem }) => (
  <View className="p-2 mb-4 bg-gray-300 rounded-lg">
    <View className="flex-row justify-between p-3 mb-2 bg-slate-500">
      <Text
        className={`font-bold ${
          item.status === "Approved" ? "text-green-600" : "text-red-600"
        }`}>
        ID: {item.id} {item.status}
      </Text>
      <Text className="text-gray-600">{item.createDate.split(" ")[0]}</Text>
    </View>
    <Text>Create Date: {item.createDate}</Text>
    {item.expireDate && <Text>Expire Date: {item.expireDate}</Text>}
    <Text className="mt-2">Images Or Documents</Text>
    <View className="flex-row mt-2">
      {[1, 2, 3].map((_, index) => (
        <View key={index} className="mr-2 bg-gray-400 rounded w-15 h-15" />
      ))}
    </View>
    {item.reason && (
      <View className="mt-2">
        <Text className="font-bold">Reason:</Text>
        <Text className="text-sm">{item.reason}</Text>
      </View>
    )}
  </View>
);

export default ItemFinanceProof;
