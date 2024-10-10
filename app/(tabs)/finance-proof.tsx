import React, { useCallback, useState } from "react";
import { View, Text, SectionList, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getListFinancialProof } from "@/api/financeProofApi";
import { RootState } from "@/redux/store";
import { FinancialProof } from "../types/finance_proof_type";
import ItemFinanceProof from "@/components/ItemFinaceProof";

type RootStackParamList = {
  FinanceProof: undefined;
  CreateFinanceProof: undefined;
};

const FinanceProof = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [financialProofData, setFinancialProofData] = useState<
    FinancialProof[]
  >([]);
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
        });
    }, [userResponse?.id])
  );

  const groupDataByMonth = (data: FinancialProof[]) => {
    const sortedData = [...data].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    const grouped = sortedData.reduce((acc, item) => {
      const date = new Date(item.startDate);
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
        const dateA = new Date(a.data[0].startDate);
        const dateB = new Date(b.data[0].startDate);
        return dateB.getTime() - dateA.getTime();
      });
  };

  return (
    <View className="flex flex-col justify-center gap-10 p-2">
      {userResponse?.bidLimit ? (
        <Text className="text-2xl font-bold ">
          Your Approved Bidding Limit: {userResponse.bidLimit} VNĐ
        </Text>
      ) : (
        <Text className="text-2xl font-bold text-center ">
          You Have Not Been Approved For A Bidding Limit
        </Text>
      )}

      <TouchableOpacity
        className="self-start w-1/2 p-2 bg-blue-500 rounded-lg"
        onPress={() => navigation.navigate("CreateFinanceProof")}>
        <Text className="text-lg font-bold text-center text-white">
          Create A Finance Proof
        </Text>
      </TouchableOpacity>

      {financialProofData.length > 0 ? (
        <SectionList
          className="bg-transparent h-5/6"
          sections={groupDataByMonth(financialProofData)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ItemFinanceProof item={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="p-2 text-xl font-bold bg-transparent">
              {title}
            </Text>
          )}
        />
      ) : (
        <Text className="text-lg font-bold text-center">
          You Have Not Created Any Financial Proof
        </Text>
      )}
    </View>
  );
};

export default FinanceProof;
