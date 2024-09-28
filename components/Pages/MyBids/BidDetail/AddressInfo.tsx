// AddressInfo.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface AddressInfoProps {
  user: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: any;
  };
}
// Define the types for navigation routes
type RootStackParamList = {
  EditAddress: undefined;
};

const AddressInfo: React.FC<AddressInfoProps> = ({ user }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const handleEditAddress = () => {
    navigation.navigate("EditAddress");
  };
  return (
    <View className="p-4 mx-4 bg-white rounded-md  shadow-lg">
      <View className="flex-row justify-between">
        <Text className="text-xl font-bold mb-2 text-gray-900">
          Adress Information
        </Text>
        <TouchableOpacity onPress={handleEditAddress}>
          <MaterialCommunityIcons name="pencil" size={24} color="#848484" />
        </TouchableOpacity>
      </View>
      <View className="flex-row">
        <Text className="mr-2 text-lg font-medium text-gray-800">
          {user.firstName} {user.lastName}
        </Text>
        <Text className="text-lg font-medium text-gray-800 ">
          | {user.phoneNumber}
        </Text>
      </View>
      <Text className="text-base font-medium text-gray-600">
        {user.address ||
          "190/5, Linh Trung Street, Linh Trung Ward, Thu Duc City, Ho Chi Minh"}
      </Text>
    </View>
  );
};

export default AddressInfo;
