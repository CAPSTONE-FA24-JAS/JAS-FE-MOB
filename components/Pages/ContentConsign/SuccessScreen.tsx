import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
  HistoryItemConsign: undefined;
};

type SuccessScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface SuccessScreenProps {
  navigation: SuccessScreenNavigationProp;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ navigation }) => {
  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      {/* Success Message */}
      <Text className="text-2xl text-blue-600 font-bold mb-4">Success!</Text>
      <Text className="text-lg text-center mb-8">
        Your item has been sent to the manager for review. Please wait for
        further evaluation. You can follow the item in the history section.
      </Text>

      {/* History Button */}
      <TouchableOpacity
        className="py-3 px-8 bg-blue-500 rounded-lg mb-4"
        onPress={() => navigation.navigate("HistoryItemConsign")} // Navigate to History Page
      >
        <Text className="text-white text-lg font-semibold">
          History Item Consign
        </Text>
      </TouchableOpacity>

      {/* Home Button */}
      <TouchableOpacity
        className="py-3 px-8 bg-gray-500 rounded-lg"
        onPress={() => navigation.navigate("Home")} // Navigate back to Home
      >
        <Text className="text-white text-lg font-semibold">Return to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessScreen;
