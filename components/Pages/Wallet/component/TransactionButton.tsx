import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React from "react";
import { TouchableOpacity, Text, Image } from "react-native";

interface TransactionButtonProps {
  title: string;
  icon: string;
}

// Define the types for navigation routes
type RootStackParamList = {
  Deposit: undefined;
  Withdraw: undefined;
};

const TransactionButton: React.FC<TransactionButtonProps> = ({
  title,
  icon,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleClick = () => {
    if (icon === "deposit") {
      navigation.navigate("Deposit"); // Navigate to Deposit screen
    } else if (icon === "withdraw") {
      navigation.navigate("Withdraw"); // Navigate to Withdraw screen
    }
  };
  return (
    <TouchableOpacity
      onPress={handleClick}
      className="flex-1 items-center gap-2 border-gray-200 border-2 justify-center py-4 bg-white rounded-lg shadow-md mx-2"
    >
      {icon === "deposit" ? (
        <Image
          source={require("../../../../assets/icons/deposit.png")}
          className="w-12 h-12 flex-row justify-center"
        />
      ) : (
        <Image
          source={require("../../../../assets/icons/withdraw.png")}
          className="w-12 h-12 flex-row justify-center"
        />
      )}
      <Text className="text-lg font-bold">{title}</Text>
    </TouchableOpacity>
  );
};

export default TransactionButton;
