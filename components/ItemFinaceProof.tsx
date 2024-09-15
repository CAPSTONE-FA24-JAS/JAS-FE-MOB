import { FinancialProof } from "@/app/types/finance_proof_type";
import React from "react";
import { View, Text } from "react-native";

const ItemFinanceProof = ({ item }: { item: FinancialProof }) => (
  <View className="p-2 mb-4 bg-gray-300 rounded-lg">
    <View className="flex-row justify-between p-3 mb-2 bg-slate-500">
      <Text
        className={`font-bold ${
          item.status === "Approved" ? "text-green-600" : "text-red-600"
        }`}>
        ID: {item.id} {item.status}
      </Text>
      <Text className="text-gray-600">{item.startDate.split(" ")[0]}</Text>
    </View>
    <Text>Create Date: {item.startDate}</Text>
    {item.expireDate && <Text>Expire Date: {item.expireDate}</Text>}
    <Text className="mt-2">Images Or Documents</Text>
    <View className="flex-row mt-2">
      {[1, 2, 3].map((_, index) => (
        <View key={index} className="mr-2 bg-gray-400 rounded w-15 h-15" />
      ))}
    </View>
    {item.accountName && (
      <View className="mt-2">
        <Text className="font-bold">Reason:</Text>
        <Text className="text-sm">
          {item.accountName} do chưa có trương reason
        </Text>
      </View>
    )}
  </View>
);

export default ItemFinanceProof;
