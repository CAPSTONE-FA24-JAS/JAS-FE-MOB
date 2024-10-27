import React from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { FinancialProof } from "@/app/types/finance_proof_type";
import { isImageFile, parseDate } from "@/utils/utils";

const ItemFinanceProof = ({ item }: { item: FinancialProof }) => {
  const isImage = isImageFile(item.file || "");
  const handleFileOpen = async () => {
    if (item.file) {
      const supported = await Linking.canOpenURL(item.file);
      if (supported) {
        await Linking.openURL(item.file);
      } else {
        console.error("Don't know how to open this URL:", item.file);
      }
    }
  };

  return (
    <View className="mb-4 bg-white border border-black rounded-lg divide-solid">
      <View className="flex-row justify-between p-3 px-2 mb-2 rounded-t-lg bg-[#D2D2D2] ">
        <Text
          className={`font-bold ${
            item.status === "Approve"
              ? "text-green-600"
              : item.status === "Reject"
              ? "text-red-600"
              : "text-yellow-600"
          } text-base`}>
          ID: #{item.id} {item.status}
        </Text>
        <Text className="text-base text-gray-600">
          {parseDate(item.startDate, "dd/mm/yyyy")}
        </Text>
      </View>
      <View className="p-2 pt-1">
        {item.expireDate && (
          <View className="flex flex-row justify-between">
            <Text>Expire Date: </Text>
            <Text>{parseDate(item.expireDate, "dd/mm/yyyy")} </Text>
          </View>
        )}
        <Text className="mt-2">File Preview:</Text>
        <View className="w-full mt-2">
          {isImage ? (
            <Image
              source={{ uri: item.file || "" }}
              className="w-full h-40 rounded"
              resizeMode="cover"
            />
          ) : (
            <TouchableOpacity
              onPress={handleFileOpen}
              className="p-2 bg-blue-500 rounded">
              <Text className="text-center text-white">Open File</Text>
            </TouchableOpacity>
          )}
        </View>
        {item.reason && (
          <View className="mt-2">
            <Text className="font-bold">Reason:</Text>
            <Text className="text-sm">{item.reason}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ItemFinanceProof;
