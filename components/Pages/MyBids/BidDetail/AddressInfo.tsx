// AddressInfo.tsx
import { AddressListData } from "@/app/types/address_type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AddressInfoProps {
  user: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
  };
  onChooseAddress: () => void; // New prop to trigger modal
  setAddressCompany: (address: AddressListData | null) => void;
}
// Define the types for navigation routes
type RootStackParamList = {
  EditAddress: undefined;
};

const AddressInfo: React.FC<AddressInfoProps> = ({
  user,
  onChooseAddress,
  setAddressCompany,
}) => {
  const [isReceiveAtCompany, setIsReceiveAtCompany] = useState<boolean>(false);

  useEffect(() => {
    // Khi component được mount, reset lại trạng thái (hoặc điều khiển khi quay lại trang)
    setIsReceiveAtCompany(false);
    setAddressCompany(null);
  }, []); // Trạng thái này chỉ thay đổi một lần khi trang được mở
  // Địa chỉ công ty
  const companyAddress: AddressListData = {
    id: 32,
    addressLine:
      "Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000",
    isDefault: null,
  };

  const handleSelectCompanyAddress = () => {
    setIsReceiveAtCompany(true);
    setAddressCompany(companyAddress); // Set company address when selected
  };

  const handleSelectPersonalAddress = () => {
    setIsReceiveAtCompany(false);
    setAddressCompany(null); // Clear company address when selected
  };

  return (
    <View className="p-4 mx-4 bg-white rounded-md shadow-lg">
      <View className="flex-row justify-between">
        <Text className="mb-2 text-xl font-bold text-gray-900">
          Address Information
        </Text>
      </View>

      {/* Chọn kiểu giao hàng */}
      <View className="flex-row justify-between mb-6">
        <TouchableOpacity
          onPress={handleSelectCompanyAddress}
          className={`${
            isReceiveAtCompany
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          } p-2 w-[45%] rounded-md mr-2`}>
          <Text
            className={`${
              !isReceiveAtCompany ? "text-gray-800" : "text-white"
            } text-center font-semibold`}>
            Delivered at the company
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSelectPersonalAddress}
          className={`${
            !isReceiveAtCompany
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          } p-2 rounded-md w-[45%]`}>
          <Text
            className={`${
              !isReceiveAtCompany ? "text-white" : "text-gray-800"
            } text-center font-semibold`}>
            Home delivery
          </Text>
        </TouchableOpacity>
      </View>
      <View className="px-3 py-3 border-2 border-gray-100 rounded-md">
        {/* Hiển thị địa chỉ tùy thuộc vào lựa chọn */}
        {isReceiveAtCompany ? (
          <View>
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
                {companyAddress.addressLine}
              </Text>
            </View>
          </View>
        ) : (
          <View>
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
            <TouchableOpacity
              onPress={onChooseAddress}
              className="absolute top-0 right-0">
              <MaterialCommunityIcons name="pencil" size={24} color="#848484" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/*       
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
      </View> */}
    </View>
  );
};

export default AddressInfo;
