// AddressInfo.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AddressInfoProps {
  user: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
  };
  onChooseAddress: () => void; // New prop to trigger modal
}
// Define the types for navigation routes
type RootStackParamList = {
  EditAddress: undefined;
};

const AddressInfo: React.FC<AddressInfoProps> = ({ user, onChooseAddress }) => {
  return (
    <View className="p-4 mx-4 bg-white rounded-md shadow-lg">
      <View className="flex-row justify-between">
        <Text className="mb-2 text-xl font-bold text-gray-900">
          Address Information
        </Text>
        <TouchableOpacity onPress={onChooseAddress}>
          <MaterialCommunityIcons name="pencil" size={24} color="#848484" />
        </TouchableOpacity>
      </View>
      <View className="flex-row">
        <Text className="mr-2 text-lg font-medium text-gray-800">
          {user.lastName ?? ""} {user.firstName ?? ""}
        </Text>
        <Text className="text-lg font-medium text-gray-800">|</Text>
        <Text className="ml-2 text-lg font-medium text-gray-800">
          {user.phoneNumber ?? "No Phone Number"}
        </Text>
      </View>
      <View>
        <Text className="text-base font-medium text-gray-600">
          {user.address || "No Address"}
        </Text>
      </View>
    </View>
  );
};

export default AddressInfo;
