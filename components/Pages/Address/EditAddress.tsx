import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { styled } from "nativewind";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { useNavigation } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

interface Address {
  id: number;
  address: string;
  isDefault: boolean;
}

const EditAddress: React.FC = () => {
  const navigation = useNavigation(); // Initialize navigation

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      address:
        "Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000",
      isDefault: true,
    },
    {
      id: 2,
      address:
        "Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000",
      isDefault: false,
    },
    {
      id: 3,
      address:
        "Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000",
      isDefault: false,
    },
    {
      id: 4,
      address:
        "Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000",
      isDefault: false,
    },
  ]);

  const [fullName, setFullName] = useState<string>("Nguyễn Văn A");
  const [phoneNumber, setPhoneNumber] = useState<string>("0912345678");
  const [email, setEmail] = useState<string>("abc123@gmail.com");
  const [defaultAddressId, setDefaultAddressId] = useState<number>(1); // Set to number

  const [newAddress, setNewAddress] = useState<string>(""); // State to store new address
  const [isModalVisible, setModalVisible] = useState<boolean>(false); // Modal visibility
  const [isEditing, setIsEditing] = useState<boolean>(false); // Determine if editing or adding a new address
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null); // Store the id of the address being edited

  const handleSetDefault = (id: number) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id
          ? { ...addr, isDefault: true }
          : { ...addr, isDefault: false }
      )
    );
    setDefaultAddressId(id); // Ensure it's a number
  };

  const handleDelete = (id: number) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleEdit = (id: number) => {
    const addressToEdit = addresses.find((addr) => addr.id === id);
    if (addressToEdit) {
      setNewAddress(addressToEdit.address);
      setEditingAddressId(id);
      setIsEditing(true); // Set editing mode to true
      setModalVisible(true); // Show the modal
    }
  };

  const handleAddAddress = () => {
    setNewAddress(""); // Clear the input field
    setIsEditing(false); // Set to adding mode
    setModalVisible(true); // Show the modal when adding new address
  };
  const handleSaveNewAddress = () => {
    if (isEditing && editingAddressId !== null) {
      // Edit the existing address in place
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddressId ? { ...addr, address: newAddress } : addr
        )
      );
    } else {
      // Add a new address
      const newId = addresses.length + 1; // Generate new number id
      const newAddressObj = {
        id: newId,
        address: newAddress,
        isDefault: false,
      };
      setAddresses([...addresses, newAddressObj]);
    }
    setNewAddress(""); // Reset input field
    setEditingAddressId(null); // Reset the editing ID
    setModalVisible(false); // Close the modal
  };

  const handleCancel = () => {
    setModalVisible(false); // Hide the modal
  };

  const handleSave = () => {
    // Save logic here if necessary, e.g., send data to API or update state
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <StyledView className="flex-1 p-4 bg-white">
      <StyledView className="mb-4">
        <StyledText className="text-lg font-bold mb-2">
          EDIT MY ADDRESS
        </StyledText>
        <View className="mx-4">
          <Text className="mb-2">Full name</Text>
          <StyledTextInput
            className="border border-inherit mb-3 p-2 rounded"
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <Text className="mb-2">Phone Number</Text>
          <StyledTextInput
            className="border border-inherit mb-3 p-2 rounded"
            placeholder="Phone Number"
            value={phoneNumber}
            keyboardType="numeric"
            onChangeText={setPhoneNumber}
          />
          <Text className="mb-2">Email</Text>
          <StyledTextInput
            className="border border-inherit mb-3 p-2 rounded"
            placeholder="Email"
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </View>
      </StyledView>
      <View className="flex-row justify-end mr-4">
        <StyledTouchableOpacity
          className="bg-gray-400 p-3 w-1/3 rounded mb-4"
          onPress={handleAddAddress}
        >
          <StyledText className="text-white font-bold uppercase text-center">
            + Add address
          </StyledText>
        </StyledTouchableOpacity>
      </View>

      <ScrollView className="mx-4">
        {addresses.map((address, index) => (
          <View className="flex-row" key={address.id}>
            <StyledTouchableOpacity
              className={`border-2 flex-row p-2 mx-autop-3 rounded-md mb-3 flex-row items-center  w-[90%] ${
                address.isDefault ? "border-red-500" : "border-gray-300"
              }`}
              onPress={() => handleSetDefault(address.id)}
            >
              <View className="flex-row justify-center w-[12%]">
                <RadioButton
                  value={address.id.toString()} // Ensure string for RadioButton
                  status={
                    defaultAddressId === address.id ? "checked" : "unchecked"
                  }
                  onPress={() => handleSetDefault(address.id)}
                />
              </View>
              <View className="w-[88%]">
                {address.isDefault && (
                  <StyledText className="text-red-500 font-bold">
                    Mặc định
                  </StyledText>
                )}
                <StyledText className="text-gray-700 text-base">
                  {address.address}
                </StyledText>
              </View>
            </StyledTouchableOpacity>

            <StyledView className="w-[10%] ml-3">
              <StyledTouchableOpacity
                onPress={() => handleEdit(address.id)}
                className="flex-row  my-2 items-center"
              >
                <MaterialCommunityIcons name="pen" size={24} color="gray" />
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                onPress={() => handleDelete(address.id)}
                className="flex-row items-center my-2"
              >
                <MaterialCommunityIcons
                  name="trash-can"
                  size={24}
                  color="gray"
                />
              </StyledTouchableOpacity>
            </StyledView>
          </View>
        ))}
      </ScrollView>

      {/* Modal for adding or editing an address */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}
      >
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="bg-white p-6 rounded-md w-4/5">
            <StyledText className="text-lg font-bold mb-4">
              {isEditing ? "Edit Address" : "Add New Address"}
            </StyledText>
            <StyledTextInput
              className="border border-gray-300 p-3 mb-4 rounded"
              placeholder="Enter Address"
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <View className="flex-row justify-between">
              <StyledTouchableOpacity
                className="bg-red-500 p-3 rounded w-[45%]"
                onPress={handleCancel}
              >
                <StyledText className="text-white text-center">
                  Cancel
                </StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                className="bg-blue-500 p-3 rounded w-[45%]"
                onPress={handleSaveNewAddress}
              >
                <StyledText className="text-white text-center">
                  {isEditing ? "Save" : "Add"}
                </StyledText>
              </StyledTouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <StyledTouchableOpacity
        className="bg-blue-500 p-3 rounded mt-4"
        onPress={handleSave}
      >
        <StyledText className="text-white text-center">SAVE EDIT</StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default EditAddress;
