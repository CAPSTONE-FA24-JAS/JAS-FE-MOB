import { useNavigation } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the types for navigation routes
type RootStackParamList = {
  ConsignStep: undefined;
};

const Consign: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <View className="flex-1 bg-white">
      <View className="h-full mx-4">
        <Text className="my-6 text-lg font-semibold text-center ">
          Consignment is a simple process that allows you to send us your
          valuable items for review. We can estimate its value and eventually
          offer it at one of our auctions!
        </Text>
        <View className="flex flex-row justify-center">
          <Image
            source={require("../../assets/consign/bg-consign.png")} // Replace with your logo path
            style={{ width: 400, height: 300, marginBottom: 20 }}
          />
        </View>
        <TouchableOpacity
          className="mt-10"
          onPress={() => navigation.navigate("ConsignStep")}>
          <View
            className="flex flex-row items-center justify-center w-full h-16 bg-blue-500 rounded-lg"
            style={{ marginBottom: 20 }}>
            <Text className="text-xl font-bold text-white uppercase">
              Get Started
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Consign;
