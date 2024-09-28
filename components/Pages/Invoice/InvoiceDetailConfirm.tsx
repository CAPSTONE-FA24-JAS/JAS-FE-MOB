import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native"; // Import CheckBox
import { styled } from "nativewind";
import { Checkbox, RadioButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

// Define the types for navigation routes
type RootStackParamList = {
  EditAddress: undefined;
};

const InvoiceDetailConfirm: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [fullName, setFullName] = useState<string>("Nguyễn Văn A");
  const [phoneNumber, setPhoneNumber] = useState<string>("0912345678");
  const [email, setEmail] = useState<string>("abc123@gmail.com");
  const [address, setAddress] = useState<string>(
    "Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh"
  );
  const [note, setNote] = useState<string>("");

  // State for handling the modal and checkbox
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("1"); // Track selected address by id

  // Mock data for the address list
  const addressData = [
    {
      id: "1",
      address:
        "Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh",
      isDefault: true,
    },
    {
      id: "2",
      address: "Số 12, Đường ABC, Quận 7, Thành Phố Hồ Chí Minh",
      isDefault: false,
    },
    {
      id: "3",
      address: "Số 5, Đường DEF, Quận 3, Thành Phố Hồ Chí Minh",
      isDefault: false,
    },
  ];

  const handleChooseAddress = () => {
    setModalVisible(true); // Show the modal
  };

  const handleConfirmAddress = () => {
    // Get the selected address from addressData and update the input field
    const selected = addressData.find((item) => item.id === selectedAddress);
    if (selected) {
      setAddress(selected.address);
    }
    setModalVisible(false); // Close the modal
  };

  const handleConfirm = () => {
    console.log("Confirmed");
  };

  const handleEditAddress = () => {
    navigation.navigate("EditAddress");
  };

  return (
    <StyledView className="flex-1 bg-white p-4">
      <ScrollView>
        {/* Customer Information */}
        <StyledText className="text-lg font-bold mb-2">
          CUSTOMER INFORMATION
        </StyledText>

        <StyledText className="text-base mb-1">Full Name</StyledText>
        <StyledTextInput
          className="border border-gray-300 p-2 rounded mb-3"
          value={fullName}
          editable={true}
          onChangeText={setFullName}
        />

        <StyledText className="text-base mb-1">Phone Number</StyledText>
        <StyledTextInput
          className="border border-gray-300 p-2 rounded mb-3"
          value={phoneNumber}
          editable={true}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <StyledText className="text-base mb-1">Email</StyledText>
        <StyledTextInput
          className="border border-gray-300 p-2 rounded mb-3"
          value={email}
          editable={true}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <StyledText className="text-base mb-1">Address</StyledText>
        <StyledView className="flex-row justify-between items-center mb-3">
          <StyledTextInput
            className="border border-gray-300 p-2 rounded flex-1"
            value={address}
            editable={false}
            numberOfLines={1}
          />
          <StyledTouchableOpacity
            onPress={handleChooseAddress}
            className="bg-gray-600 px-3 py-2 ml-2 rounded"
          >
            <StyledText className="text-white text-center">Choose</StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        <StyledText className="text-base mb-1">Note</StyledText>
        <StyledTextInput
          className="border border-gray-300 p-2 rounded mb-3"
          value={note}
          onChangeText={setNote}
          placeholder="Write note..."
        />

        {/* Order Information */}
        <StyledText className="text-lg font-bold mt-4 mb-2">
          ORDER INFORMATION
        </StyledText>
        <StyledView className="border-t border-b border-gray-300 py-3 mb-3">
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Order Code
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              #99999
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Auction
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              Lot 101
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Name production
            </StyledText>
            <StyledText className="text-base w-1/2 text-right font-medium text-gray-600">
              Tiffany & Co. Soleste Tanzanite And Diamond Earrings
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Loại hàng
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              Diamond Necklace
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Giá đấu
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              32.000.000 VND
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Fee 10%
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              3.200.000 VND
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mt-3">
            <StyledText className="text-lg font-bold">Total</StyledText>
            <StyledText className="text-lg font-bold">
              35.200.000 VND
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Terms and Conditions */}
        <StyledView className="flex-row items-center mb-3">
          <Checkbox
            status={isChecked ? "checked" : "unchecked"}
            onPress={() => setIsChecked(!isChecked)}
          />
          <StyledText className="text-base font-medium w-[90%] ml-2 text-gray-600">
            I have read and agree to the{" "}
            <StyledText className="text-blue-600">Terms of Use</StyledText> and{" "}
            <StyledText className="text-blue-600">Privacy Policy</StyledText>.
          </StyledText>
        </StyledView>

        {/* Confirm Button */}
        <StyledTouchableOpacity
          disabled={!isChecked}
          onPress={handleConfirm}
          className={`p-3 rounded ${isChecked ? "bg-blue-500" : "bg-gray-300"}`}
        >
          <StyledText className="text-white text-center font-bold">
            CONFIRM
          </StyledText>
        </StyledTouchableOpacity>
      </ScrollView>
      {/* Address Selection Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <StyledView className="flex-1 justify-center items-center bg-black/50">
          <StyledView className="bg-white w-4/5 p-5 rounded-lg">
            <View className="flex-row justify-between">
              <StyledText className="text-lg font-bold mb-4">
                Choose Address
              </StyledText>
              <TouchableOpacity onPress={handleEditAddress}>
                <MaterialCommunityIcons
                  name="pencil"
                  size={24}
                  color="#848484"
                />
              </TouchableOpacity>
            </View>

            <RadioButton.Group
              onValueChange={(newValue) => setSelectedAddress(newValue)}
              value={selectedAddress}
            >
              {addressData.map((item) => (
                <StyledTouchableOpacity
                  key={item.id}
                  className="border border-gray-300  p-3 rounded mb-2"
                  onPress={() => setSelectedAddress(item.id)}
                >
                  <StyledView className="flex-row w-[90%] items-center">
                    <RadioButton value={item.id} />
                    <View className="ml-2">
                      {item.isDefault && (
                        <Text className="text-red-500 font-semibold">
                          Mặc định{" "}
                        </Text>
                      )}
                      <StyledText className="">{item.address}</StyledText>
                    </View>
                  </StyledView>
                </StyledTouchableOpacity>
              ))}
            </RadioButton.Group>

            <StyledView className="flex-row justify-between mt-4">
              <StyledTouchableOpacity
                className="bg-red-500 p-2 rounded w-[45%]"
                onPress={() => setModalVisible(false)}
              >
                <StyledText className="text-white font-semibold  text-center">
                  Cancel
                </StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                className="bg-blue-500 p-2 rounded w-[45%]"
                onPress={handleConfirmAddress}
              >
                <StyledText className="text-white font-semibold text-center">
                  Save
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledView>
  );
};

export default InvoiceDetailConfirm;
