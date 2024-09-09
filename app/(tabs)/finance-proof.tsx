import ItemFinanceProof, {
  FinancialProofItem,
} from "@/components/ItemFinaceProof";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, Text, SectionList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

// Định nghĩa kiểu RootStackParamList
type RootStackParamList = {
  FinanceProof: undefined;
  CreateFinanceProof: undefined;
};

interface FinancialProofSection {
  title: string;
  data: FinancialProofItem[];
}

const FinanceProof = () => {
  // Sử dụng StackNavigationProp với RootStackParamList
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const financialProofData: FinancialProofSection[] = [
    {
      title: "09/2024",
      data: [
        {
          id: "#123",
          status: "Approved",
          createDate: "12:06 20/08/2024",
          expireDate: "12:06 20/04/2025",
        },
        {
          id: "#124",
          status: "Reject",
          createDate: "12:06 20/08/2024",
          reason:
            "Your Financial Proof Submission Has Been Reviewed And Unfortunately, It Does Not Meet The Required Criteria. The Documents Provided Are Either Incomplete Or Do Not Clearly Demonstrate Sufficient Financial Capability. Please Ensure That All Necessary Documents, Such As Bank Statements Or Income Certificates, Are Included And Resubmit Your Proof.",
        },
      ],
    },
  ];

  return (
    <View className="flex flex-col justify-center gap-2 m-3">
      <Text className="text-3xl font-bold text-center">
        Your Approved Bidding Limit: 5.000.000.000 VNĐ
      </Text>
      <TouchableOpacity
        className="w-1/2 p-2 m-2 bg-blue-200 rounded-lg"
        onPress={() => navigation.navigate("CreateFinanceProof")}>
        <Text className="text-lg font-bold text-center text-blue-500">
          Create A Finance Proof
        </Text>
      </TouchableOpacity>
      <SectionList
        sections={financialProofData}
        keyExtractor={(item, index) => item.id + index}
        renderItem={ItemFinanceProof}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="mb-2 text-lg font-bold">{title}</Text>
        )}
      />
    </View>
  );
};

export default FinanceProof;
