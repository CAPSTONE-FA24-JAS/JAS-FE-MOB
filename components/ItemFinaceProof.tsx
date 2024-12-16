import React from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { FinancialProof } from "@/app/types/finance_proof_type";
import { isImageFile, parseDate } from "@/utils/utils";

interface ItemFinanceProofProps {
  item: FinancialProof;
  onImagePress?: (imageUrl: string) => void;
}

const ItemFinanceProof = ({ item, onImagePress }: ItemFinanceProofProps) => {
  const isImage = isImageFile(item?.file ?? "");

  const handleFileOpen = async () => {
    if (!item?.file) return;
    try {
      const supported = await Linking.canOpenURL(item.file);
      if (supported) {
        await Linking.openURL(item.file);
      } else {
        console.error("Cannot open this URL:", item.file);
      }
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusStyles = (status: string | null | undefined) => {
    const baseStyle = "px-2 py-1 rounded-full text-xs font-semibold";
    switch (status?.toLowerCase()) {
      case "approve":
        return `${baseStyle} bg-green-100 text-green-800`;
      case "reject":
        return `${baseStyle} bg-red-100 text-red-800`;
      default:
        return `${baseStyle} bg-yellow-100 text-yellow-800`;
    }
  };

  const renderFilePreview = () => {
    if (!item?.file) {
      return (
        <View className="flex items-center justify-center w-full h-48 border border-gray-200 rounded-lg bg-gray-50">
          <Text className="font-medium text-gray-400">No file available</Text>
        </View>
      );
    }

    if (isImage) {
      return (
        <TouchableOpacity
          onPress={() => onImagePress?.(item.file ?? "")}
          activeOpacity={0.95}
          className="w-full aspect-[4/3]">
          <Image
            source={{ uri: item.file }}
            className="w-full h-full rounded-lg bg-gray-50"
            resizeMode="cover"
          />
          <View className="absolute bottom-3 right-3 bg-black bg-opacity-60 px-3 py-1.5 rounded-full flex-row items-center">
            <Text className="text-xs font-medium text-white">
              View Full Image
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={handleFileOpen}
        className="w-full p-4 border border-blue-100 rounded-lg bg-blue-50 active:bg-blue-100">
        <Text className="font-semibold text-center text-blue-600">
          Open Document
        </Text>
      </TouchableOpacity>
    );
  };

  if (!item) return null;

  return (
    <View className="mb-4 bg-white border border-gray-100 shadow-sm rounded-xl">
      {/* Header Section */}
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center space-x-2">
            <Text className="font-medium text-gray-600">
              #{item?.id ?? "N/A"}
            </Text>
            <View>
              <Text className={getStatusStyles(item.status)}>
                {item?.status ?? "Unknown"}
              </Text>
            </View>
          </View>
          <View className="px-3 py-1 rounded-full bg-gray-50">
            <Text className="text-sm text-gray-600">
              {item?.startDate
                ? parseDate(item.startDate, "dd/mm/yyyy")
                : "N/A"}
            </Text>
          </View>
        </View>

        {/* Price Limit Section */}
        <View className="p-3 mt-2 rounded-lg bg-gray-50">
          <Text className="mb-1 text-sm text-gray-500">
            Approved Bidding Limit
          </Text>
          <Text className="text-lg font-semibold text-gray-800">
            {formatPrice(item.priceLimit)}
          </Text>
        </View>

        {/* Customer & Staff Info */}
        <View className="mt-3 space-y-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-500">Customer</Text>
            <Text className="font-medium text-gray-700">
              {item.customerName}
            </Text>
          </View>
          {item.staffId && (
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500">Processed by</Text>
              <Text className="font-medium text-gray-700">
                {item.staffName}
              </Text>
            </View>
          )}
        </View>

        {/* Expiration Date */}
        {item?.expireDate && (
          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-gray-500">Expire Date</Text>
            <Text className="font-medium text-gray-700">
              {parseDate(item.expireDate, "dd/mm/yyyy")}
            </Text>
          </View>
        )}
      </View>

      {/* File Preview Section */}
      <View className="p-4">
        <Text className="mb-3 font-medium text-gray-600">File Preview</Text>
        <View className="w-full">{renderFilePreview()}</View>

        {/* Reason Section */}
        {item?.reason && (
          <View className="p-3 mt-4 rounded-lg bg-gray-50">
            <Text className="mb-1 font-medium text-gray-600">Reason</Text>
            <Text className="text-sm leading-relaxed text-gray-600">
              {item.reason}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ItemFinanceProof;
