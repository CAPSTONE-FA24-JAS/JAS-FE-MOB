import React from "react";
import { View, ScrollView } from "react-native";
import BalanceCard from "./component/BalanceCard";
import TransactionButton from "./component/TransactionButton";
import InfoCard from "./component/InfoCard";
import TransactionHistory from "./component/TransactionHistory";

const MyWalletMain: React.FC = () => {
  return (
    <ScrollView className="bg-white flex-1 p-2">
      {/* Balance */}
      <BalanceCard />

      {/* Transaction Buttons */}
      <View className="flex-row justify-around mb-4">
        <TransactionButton title="Deposit" icon="deposit" />
        <TransactionButton title="Withdraw" icon="withdraw" />
      </View>

      {/* Info Cards */}
      <InfoCard />

      {/* Transaction History */}
      <TransactionHistory />
    </ScrollView>
  );
};

export default MyWalletMain;
