import { getListFinancialProof } from "@/api/financeProofApi";
import ItemFinanceProof from "@/components/ItemFinaceProof";
import { RootState } from "@/redux/store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, SectionList } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { FinancialProof } from "../types/finance_proof_type";

// Định nghĩa kiểu RootStackParamList
type RootStackParamList = {
  FinanceProof: undefined;
  CreateFinanceProof: undefined;
};

const FinanceProof = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [financialProofData, setFinancialProofData] =
    useState<FinancialProof[]>();

  const { userResponse } = useSelector((state: RootState) => state.auth);

  useFocusEffect(
    useCallback(() => {
      console.log("FinanceProof Screen Mounted or Returned");
      getListFinancialProof(userResponse?.id)
        .then((response) => {
          setFinancialProofData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching financial proof data:", error);
          setFinancialProofData([]);
        })
        .finally(() => {});
    }, [userResponse?.id])
  );

  return (
    <View className="flex flex-col justify-center gap-2 m-3">
      {userResponse?.bidLimit ? (
        <Text className="text-3xl font-bold text-center">
          Your Approved Bidding Limit: {userResponse.bidLimit} VNĐ
        </Text>
      ) : (
        <Text className="text-3xl font-bold text-center text-red-700">
          You Have Not Been Approved For A Bidding Limit
        </Text>
      )}

      <TouchableOpacity
        className="w-1/2 p-2 m-2 bg-blue-200 rounded-lg"
        onPress={() => navigation.navigate("CreateFinanceProof")}>
        <Text className="text-lg font-bold text-center text-blue-500">
          Create A Finance Proof
        </Text>
      </TouchableOpacity>

      {financialProofData && financialProofData.length > 0 ? (
        <FlatList
          data={financialProofData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ItemFinanceProof item={item} />}
        />
      ) : (
        <Text className="text-2xl font-bold text-center text-red-700">
          You Have Not Created Any Financial Proof
        </Text>
      )}
    </View>
  );
};

export default FinanceProof;
