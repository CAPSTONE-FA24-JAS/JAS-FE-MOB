import React, { useState } from "react";
import { ScrollView, Text } from "react-native";
import { View } from "react-native";
import BalanceCard from "./component/BalanceCard";
import { Avatar, Card, RadioButton } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import WithdrawAmount from "./component/WithdrawAmount";

const Withdraw: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<string>("momo");

  return (
    <ScrollView className="bg-white flex-1 p-2">
      {/* Balance */}
      <BalanceCard />
      <WithdrawAmount />
      <View className="px-2">
        {/* Choose Payment Method */}
        <Text className="text-lg font-semibold mb-2">
          2. CHOOSE PAYMENT METHOD
        </Text>

        <Text className="text-red-500 font-semibold mb-4">
          Note: Sau khi thanh toán gián tiếp thành công, bạn cần chụp màn hình
          bill chuyển khoản và upload lên lại app JAS.
        </Text>

        {/* MoMo Payment */}
        <Card className="mb-4 bg-white">
          <TouchableOpacity
            onPress={() => setSelectedPayment("momo")}
            className="flex-row justify-between items-center p-4"
          >
            <View className="flex-row items-center">
              <Avatar.Image
                source={require("../../../assets/logo/MoMo_Logo.png")}
                size={40}
              />
              <View className="ml-3">
                <Text className="text-lg font-semibold">MoMo</Text>
                <Text>Tài khoản ví MoMo</Text>
              </View>
            </View>
            <RadioButton
              value="momo"
              status={selectedPayment === "momo" ? "checked" : "unchecked"}
            />
          </TouchableOpacity>
        </Card>

        {/* VNPay Payment */}
        <Card className="mb-4 bg-white">
          <TouchableOpacity
            onPress={() => setSelectedPayment("vnpay")}
            className="flex-row justify-between items-center p-4"
          >
            <View className="flex-row items-center">
              <Avatar.Image
                source={require("../../../assets/logo/VNpay_Logo.png")}
                size={40}
              />
              <View className="ml-3">
                <Text className="text-lg font-semibold">VNPAY</Text>
                <Text>Tài khoản ví VNPAY</Text>
              </View>
            </View>
            <RadioButton
              value="vnpay"
              status={selectedPayment === "vnpay" ? "checked" : "unchecked"}
            />
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
};

export default Withdraw;
