import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";

const NavigationButtons: React.FC = () => {
  return (
    <View className="flex-row justify-around p-4">
      <TouchableOpacity className="bg-gray-600 py-4 px-6 rounded flex-1 mx-2">
        <Image
          source={require("../../../../assets/icons/bua.png")}
          className="w-8 h-8 mb-2 mx-auto"
        />
        <Text className="text-center text-white text-base font-semibold">
          CURRENT
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-gray-600 py-4 px-6 rounded flex-1 mx-2">
        <Image
          source={require("../../../../assets/icons/history.png")}
          className="w-8 h-8 mb-2 mx-auto"
        />
        <Text className="text-center text-white text-base font-semibold">
          HISTORY
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-gray-600 py-4 px-6 rounded flex-1 mx-2">
        <Image
          source={require("../../../../assets/icons/lots.png")}
          className="w-8 h-8 mb-2 mx-auto"
        />
        <Text className="text-center text-white text-base font-semibold">
          LOTS
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NavigationButtons;
