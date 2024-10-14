import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Card, Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

const BalanceCard: React.FC = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(false);

  return (
    <View className="p-2">
      <Card className="mb-4 bg-white">
        <Card.Title
          title="Balance"
          left={(props) => <Avatar.Icon {...props} icon="credit-card" />}
          right={(props) => (
            <TouchableOpacity
              onPress={() => setIsBalanceVisible(!isBalanceVisible)}
              className="mr-6 mt-10"
            >
              <Icon
                name={isBalanceVisible ? "visibility" : "visibility-off"}
                size={24}
              />
            </TouchableOpacity>
          )}
        />
        <Card.Content>
          <Text className="text-3xl font-bold text-gray-800">
            {isBalanceVisible ? "55.000.000 VND" : "******** VND"}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

export default BalanceCard;
