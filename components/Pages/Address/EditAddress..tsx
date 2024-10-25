// EditAddress.tsx
import React, { useState, useEffect } from "react";
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
import { Switch } from "react-native-paper";

import { AddressListData, AddressListResponse } from "@/app/types/address_type";
import {
  createAddressToShip,
  deleteAddressToShip,
  getAddressesByCustomerId,
  setAddressToShipIsDefault,
} from "@/api/addressApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Import showMessage functions
import {
  showSuccessMessage,
  showErrorMessage,
} from "@/components/FlashMessageHelpers";
import AddAddress from "./AddAddress";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

const EditAddress: React.FC = () => {
  // Lấy customerId từ Redux store
  const customerId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.id
  );

  const [addressList, setAddressList] = useState<AddressListData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<string>("");

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      if (customerId !== undefined) {
        const response: AddressListResponse | null =
          await getAddressesByCustomerId(customerId);
        if (response) {
          setAddressList(response.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      showErrorMessage("Failed to fetch addresses.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (
    province: string,
    district: string,
    ward: string,
    deepAddress: string
  ) => {
    try {
      if (customerId !== undefined) {
        const fullAddress = `${deepAddress}, ${ward}, ${district}, ${province}`;
        await createAddressToShip(fullAddress, customerId);
        showSuccessMessage("Create New Address Successful");
        setShowAddModal(false);
        fetchAddresses();
      } else {
        showErrorMessage("Customer ID is undefined");
      }
    } catch (error) {
      console.error("Unable to create new address:", error);
      showErrorMessage("Unable to create new address");
    }
  };

  const handleToggleDefault = async (address: AddressListData) => {
    try {
      if (customerId !== undefined) {
        await setAddressToShipIsDefault(address.id, customerId);
        showSuccessMessage("Default address updated successfully");
        fetchAddresses();
      } else {
        showErrorMessage("Customer ID is undefined");
      }
    } catch (error) {
      console.error("Unable to update default address:", error);
      showErrorMessage("Unable to update default address");
    }
  };

  const confirmDeleteAddress = (id: number) => {
    setAddressToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteAddressConfirm = async () => {
    if (addressToDelete === null) return;

    try {
      await deleteAddressToShip(addressToDelete);
      showSuccessMessage("Address deleted successfully");
      setShowDeleteModal(false);
      setAddressToDelete(null);
      fetchAddresses();
    } catch (error) {
      console.error("Unable to delete address:", error);
      showErrorMessage("Unable to delete address");
      setShowDeleteModal(false);
      setAddressToDelete(null);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 bg-white">
      <StyledView className="bg-white p-6 rounded-md w-full">
        <View className="flex-row justify-between items-center mb-4">
          <StyledText className="text-lg uppercase font-bold">
            Manage Addresses
          </StyledText>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="flex-row items-center bg-slate-500 rounded-md py-2 px-3"
          >
            <MaterialCommunityIcons name="plus" size={24} color="white" />
            <Text className="font-semibold text-white text-base"> ADD</Text>
          </TouchableOpacity>
        </View>
        <ScrollView className="mb-4">
          {addressList.map((address) => (
            <View className="flex-row items-center mb-4" key={address.id}>
              <StyledView
                className={`flex-1 border-2 rounded-md p-3 ${
                  address.isDefault ? "border-red-600" : "border-gray-400"
                }`}
              >
                {address.isDefault && (
                  <StyledText className="text-red-700 mb-2 font-semibold">
                    Mặc định
                  </StyledText>
                )}
                <StyledText className="text-gray-700">
                  {address.addressLine}
                </StyledText>
              </StyledView>
              <Switch
                value={address.isDefault ?? false}
                onValueChange={() => handleToggleDefault(address)}
                color="green"
                className="mr-4"
              />
              <TouchableOpacity
                onPress={() => confirmDeleteAddress(address.id)}
              >
                <MaterialCommunityIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        {/* <View className="flex-row justify-end">
          <StyledTouchableOpacity
            className="bg-red-500 p-3 rounded"
            onPress={() => showSuccessMessage("Operation canceled")}
          >
            <StyledText className="text-white text-center">Cancel</StyledText>
          </StyledTouchableOpacity>
        </View> */}
      </StyledView>

      {/* AddAddress Modal */}
      <AddAddress
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAddress}
      />

      {/* Confirmation Modal for Delete */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <StyledView className="bg-white p-6 rounded-md w-4/5">
            <StyledText className="text-lg font-bold mb-4">
              Confirm Delete
            </StyledText>
            <StyledText className="mb-4">
              Are you sure you want to delete this address?
            </StyledText>
            <View className="flex-row justify-end">
              <StyledTouchableOpacity
                className="bg-gray-400 p-3 rounded mr-2"
                onPress={() => setShowDeleteModal(false)}
              >
                <StyledText className="text-white">Cancel</StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                className="bg-red-500 p-3 rounded"
                onPress={handleDeleteAddressConfirm}
              >
                <StyledText className="text-white">Delete</StyledText>
              </StyledTouchableOpacity>
            </View>
          </StyledView>
        </View>
      </Modal>
    </View>
  );
};

export default EditAddress;
