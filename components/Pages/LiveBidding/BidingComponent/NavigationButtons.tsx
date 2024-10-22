import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";

const NavigationButtons: React.FC = () => {
  return (
    <View className="flex-row justify-around gap-2 p-2">
      <TouchableOpacity className="flex-1 p-2 bg-gray-600 rounded">
        <Image
          source={require("../../../../assets/icons/bua.png")}
          className="w-8 h-8 mx-auto mb-2"
        />
        <Text className="text-sm font-semibold text-center text-white">
          CURRENT
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-1 p-2 bg-gray-600 rounded">
        <Image
          source={require("../../../../assets/icons/history.png")}
          className="w-8 h-8 mx-auto mb-2"
        />
        <Text className="text-sm font-semibold text-center text-white">
          HISTORY
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-1 p-2 bg-gray-600 rounded">
        <Image
          source={require("../../../../assets/icons/lots.png")}
          className="w-8 h-8 mx-auto mb-2"
        />
        <Text className="text-sm font-semibold text-center text-white">
          LOTS
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NavigationButtons;
