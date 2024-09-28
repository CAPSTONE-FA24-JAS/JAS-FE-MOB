// AddressInfo.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

const AddressInfo: React.FC<AddressInfoProps> = ({ user }) => {
  return (
    <View className="p-4 mx-4 bg-white rounded-md  shadow-lg">
      <View className="flex-row justify-between">
        <Text className="text-xl font-bold mb-2 text-gray-900">
          Adress Information
        </Text>
        <TouchableOpacity>
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
