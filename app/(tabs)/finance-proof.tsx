import { getListFinancialProof } from "@/api/financeProofApi";
import ItemFinanceProof from "@/components/ItemFinaceProof";
import { RootState } from "@/redux/store";
import { parseDate } from "@/utils/utils";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import {
  SectionList,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { FinancialProof } from "../types/finance_proof_type";

type RootStackParamList = {
  FinanceProof: undefined;
  CreateFinanceProof: undefined;
};

const FinanceProof = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [financialProofData, setFinancialProofData] = useState<
    FinancialProof[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const { userResponse } = useSelector((state: RootState) => state.auth);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          if (!userResponse?.customerDTO?.id) {
            console.warn("No customer ID found");
            return;
          }

          const response = await getListFinancialProof(
            userResponse.customerDTO.id
          );
          setFinancialProofData(
            Array.isArray(response?.data)
              ? response.data.filter((proof) => proof != null)
              : []
          );
        } catch (error) {
          console.error("Error fetching financial proof data:", error);
          setFinancialProofData([]);
        }
      };

      fetchData();
    }, [userResponse?.customerDTO?.id])
  );

  const groupDataByMonth = (data: FinancialProof[]) => {
    if (!Array.isArray(data)) return [];

    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a?.startDate ?? 0).getTime();
      const dateB = new Date(b?.startDate ?? 0).getTime();
      return dateB - dateA;
    });

    const grouped = sortedData.reduce((acc, item) => {
      if (!item?.startDate) return acc;

      const date = new Date(item.startDate);
      if (isNaN(date.getTime())) return acc;

      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(item);
      return acc;
    }, {} as Record<string, FinancialProof[]>);

    return Object.entries(grouped)
      .map(([title, data]) => ({ title, data }))
      .sort((a, b) => {
        const dateA = new Date(a.data[0]?.startDate ?? 0).getTime();
        const dateB = new Date(b.data[0]?.startDate ?? 0).getTime();
        return dateB - dateA;
      });
  };

  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageLoading(true);
  };

  const renderImageModal = () => (
    <Modal
      visible={!!selectedImage}
      transparent={true}
      onRequestClose={() => setSelectedImage(null)}>
      <View className="items-center justify-center flex-1 bg-black bg-opacity-90">
        {imageLoading && (
          <View className="absolute z-10">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}

        <TouchableOpacity
          className="absolute z-20 right-4 top-12"
          onPress={() => setSelectedImage(null)}>
          <Text className="text-xl font-bold text-white">✕</Text>
        </TouchableOpacity>

        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            className="w-full h-3/4"
            resizeMode="contain"
            onLoad={() => setImageLoading(false)}
          />
        )}
      </View>
    </Modal>
  );

  const formatPriceLimit = (price: number | null | undefined) => {
    if (!price) return "0";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <View className="flex flex-col justify-center gap-5 p-2">
      {userResponse?.customerDTO?.priceLimit &&
      userResponse.customerDTO?.expireDate ? (
        <View className="items-center p-2 bg-white rounded-lg shadow-sm">
          <Text className="text-2xl font-bold text-center">
            Your Approved Bidding Limit:{" "}
            {formatPriceLimit(userResponse.customerDTO.priceLimit)}
          </Text>
          <Text className="text-xl font-bold text-center">
            Expire:{" "}
            {parseDate(userResponse.customerDTO.expireDate, "dd/mm/yyyy") ??
              "N/A"}
          </Text>
        </View>
      ) : (
        <Text className="text-2xl font-bold text-center">
          You Have Not Been Approved For A Bidding Limit
        </Text>
      )}

      <TouchableOpacity
        className="px-4 py-3 mx-4 mb-4 bg-blue-500 rounded-lg shadow-sm active:bg-blue-600"
        onPress={() => navigation.navigate("CreateFinanceProof")}>
        <Text className="text-base font-semibold text-center text-white">
          Create New Bidding Limit Request
        </Text>
      </TouchableOpacity>

      {Array.isArray(financialProofData) && financialProofData.length > 0 ? (
        <SectionList
          className="bg-transparent h-3/4"
          sections={groupDataByMonth(financialProofData)}
          keyExtractor={(item) =>
            item?.id?.toString() ?? Math.random().toString()
          }
          renderItem={({ item }) => (
            <ItemFinanceProof item={item} onImagePress={handleImagePress} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="p-2 text-xl font-bold bg-transparent">
              {title}
            </Text>
          )}
          ListEmptyComponent={
            <Text className="py-4 text-lg font-bold text-center">
              No financial proof records found
            </Text>
          }
        />
      ) : (
        <Text className="text-lg font-bold text-center">
          You Have Not Created Any Financial Proof
        </Text>
      )}

      {renderImageModal()}
    </View>
  );
};

export default FinanceProof;
