// ChooseAddress.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { AddressListData } from "@/app/types/address_type";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

interface ChooseAddressProps {
  addresses: AddressListData[];
  selectedAddress: AddressListData | null;
  onSave: (address: AddressListData) => void;
  onCancel: () => void;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

// Define the types for navigation routes
type RootStackParamList = {
  EditAddress: undefined; // Định nghĩa rằng ConsignDetailTimeLine nhận một đối tượng item kiểu ConsignResponse
};

const ChooseAddress: React.FC<ChooseAddressProps> = ({
  addresses,
  selectedAddress,
  onSave,
  onCancel,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [localSelectedAddress, setLocalSelectedAddress] =
    useState<AddressListData | null>(selectedAddress);

  // Handle selecting an address
  const handleSelectAddress = (address: AddressListData) => {
    setLocalSelectedAddress(address);
  };

  // Handle saving the selected address
  const handleSave = () => {
    if (localSelectedAddress) {
      onSave(localSelectedAddress);
    }
  };

  const onEditAddress = () => {
    console.log("EditAddress");
    onCancel();
    navigation.navigate("EditAddress");
  };

  return (
    <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
      <StyledView className="bg-white p-6 rounded-md w-[90%] max-h-3/4">
        <View className="flex-row justify-between items-start">
          <StyledText className="text-lg uppercase font-bold mb-4">
            Select Address
          </StyledText>
          <TouchableOpacity onPress={onEditAddress}>
            <MaterialCommunityIcons name="pencil" size={24} color="#848484" />
          </TouchableOpacity>
        </View>
        <ScrollView className="mb-4 ">
          {addresses.map((address) => (
            <View className="flex-row items-center mb-4" key={address.id}>
              <RadioButton
                value={address.id.toString()}
                status={
                  localSelectedAddress?.id === address.id
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => handleSelectAddress(address)}
              />
              <TouchableOpacity
                onPress={() => handleSelectAddress(address)}
                className={`${
                  localSelectedAddress?.id === address.id
                    ? "border-red-600"
                    : "border-gray-400"
                } border-2 rounded-md px-3 py-2 w-[86%]`}
              >
                {address.isDefault === true && (
                  <Text className="text-red-700 mb-2 font-semibold">
                    Mặc định
                  </Text>
                )}
                <Text className="text-gray-700">{address.addressLine}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View className="flex-row justify-between">
          <StyledTouchableOpacity
            className="bg-red-500 p-3 rounded w-[45%]"
            onPress={onCancel}
          >
            <StyledText className="text-white text-center">Cancel</StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity
            className="bg-blue-500 p-3 rounded w-[45%]"
            onPress={handleSave}
            disabled={!localSelectedAddress} // Disable if no address is selected
          >
            <StyledText className="text-white text-center">Save</StyledText>
          </StyledTouchableOpacity>
        </View>
      </StyledView>
    </View>
  );
};

export default ChooseAddress;
