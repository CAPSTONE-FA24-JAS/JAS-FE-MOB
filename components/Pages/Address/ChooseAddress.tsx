// ChooseAddress.tsx
import { AddressListData } from "@/app/types/address_type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";

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

  // Địa chỉ công ty mặc định
  const companyAddress: AddressListData = {
    id: 32,
    addressLine:
      "Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000",
    isDefault: false,
  };

  // Combine user addresses with the company address
  const combinedAddresses = [companyAddress, ...addresses];

  const uniqueAddresses = combinedAddresses.reduce<AddressListData[]>(
    (unique, current) => {
      const isDuplicate = unique.some(
        (item) =>
          item.id === current.id && item.addressLine === current.addressLine
      );
      if (!isDuplicate) {
        unique.push(current);
      }
      return unique;
    },
    []
  );

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
    <View className="items-center justify-center flex-1 bg-opacity-50 bg-black/50">
      <StyledView className="bg-white p-6 rounded-md w-[90%] max-h-3/4">
        <View className="flex-row items-start justify-between">
          <StyledText className="mb-4 text-lg font-bold uppercase">
            Select Address
          </StyledText>
          {addresses.length !== 0 && (
            <TouchableOpacity onPress={onEditAddress}>
              <MaterialCommunityIcons name="pencil" size={24} color="#848484" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView className="mb-4">
          {uniqueAddresses.map((address) => (
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
                } border-2 rounded-md px-3 py-2 w-[86%]`}>
                {address.id === 32 ? (
                  <View>
                    <Text className="mb-2 font-semibold text-red-600">
                      If you choose company address, shipping will be free!
                    </Text>
                  </View>
                ) : null}
                {address.isDefault === true ? (
                  <Text className="mb-2 font-semibold text-red-700">
                    Mặc định
                  </Text>
                ) : null}
                <Text className="text-gray-700">{address.addressLine}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        {addresses.length === 0 && (
          <Text className="mb-6 text-center text-gray-500">
            No have list address to ship
          </Text>
        )}

        <View className="flex-row justify-between">
          <StyledTouchableOpacity
            className="bg-red-500 p-3 rounded w-[45%]"
            onPress={onCancel}>
            <StyledText className="text-center text-white">Cancel</StyledText>
          </StyledTouchableOpacity>
          {addresses.length === 0 ? (
            <TouchableOpacity
              className="w-1/2 p-2 mx-auto bg-blue-500 rounded-md"
              onPress={onEditAddress}>
              <Text className="font-semibold text-center text-white">
                + Add new address
              </Text>
            </TouchableOpacity>
          ) : (
            <StyledTouchableOpacity
              className="bg-blue-500 p-3 rounded w-[45%]"
              onPress={handleSave}
              disabled={!localSelectedAddress} // Disable if no address is selected
            >
              <StyledText className="text-center text-white">Save</StyledText>
            </StyledTouchableOpacity>
          )}
        </View>
      </StyledView>
    </View>
  );
};

export default ChooseAddress;
