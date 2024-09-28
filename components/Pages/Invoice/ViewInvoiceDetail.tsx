import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { useNavigation } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

// Define the types for navigation routes
type RootStackParamList = {
  EditAddress: undefined;
};

const ViewInvoiceDetail: React.FC = () => {
  const navigation = useNavigation(); // Navigation hook for handling back

  // Mock data
  const fullName = "Nguyễn Văn A";
  const phoneNumber = "0912345678";
  const email = "abc123@gmail.com";
  const address =
    "Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh";
  const note = "";
  const orderCode = "#99999";
  const auction = "Lot 101";
  const itemName = "Tiffany & Co. Soleste Tanzanite And Diamond Earrings";
  const itemType = "Diamond Necklace";
  const bidPrice = "32.000.000 VND";
  const fee = "3.200.000 VND";
  const totalPrice = "35.200.000 VND";

  // Handle back button
  const handleBack = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <StyledView className="flex-1 bg-white p-4">
      <ScrollView>
        {/* Customer Information */}
        <StyledText className="text-lg font-bold mb-2">
          CUSTOMER INFORMATION
        </StyledText>

        <StyledText className="text-base font-medium mb-1">
          Full Name
        </StyledText>
        <StyledText className="text-base mb-3 text-gray-600">
          {fullName}
        </StyledText>

        <StyledText className="text-base font-medium mb-1">
          Phone Number
        </StyledText>
        <StyledText className="text-base mb-3 text-gray-600">
          {phoneNumber}
        </StyledText>

        <StyledText className="text-base font-medium mb-1">Email</StyledText>
        <StyledText className="text-base mb-3 text-gray-600">
          {email}
        </StyledText>

        <StyledText className="text-base font-medium mb-1">Address</StyledText>
        <StyledText className="text-base mb-3 text-gray-600">
          {address}
        </StyledText>

        <StyledText className="text-base font-medium mb-1">Note</StyledText>
        <StyledText className="text-base mb-3 text-gray-600">
          {note ? note : "No additional notes"}
        </StyledText>

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
              {orderCode}
            </StyledText>
          </StyledView>

          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Auction
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {auction}
            </StyledText>
          </StyledView>

          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Name production
            </StyledText>
            <StyledText className="text-base w-1/2 text-right font-medium text-gray-600">
              {itemName}
            </StyledText>
          </StyledView>

          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Loại hàng
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {itemType}
            </StyledText>
          </StyledView>

          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Giá đấu
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {bidPrice}
            </StyledText>
          </StyledView>

          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Fee 10%
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {fee}
            </StyledText>
          </StyledView>

          <StyledView className="flex-row justify-between mt-3">
            <StyledText className="text-lg font-bold">Total</StyledText>
            <StyledText className="text-lg font-bold">{totalPrice}</StyledText>
          </StyledView>
        </StyledView>
        <StyledView className="flex-row justify-center mt-3">
          <StyledText className="text-lg font-bold"></StyledText>
          <StyledText className="text-xl font-bold text-green-500">
            PAYMENT
          </StyledText>
        </StyledView>

        {/* Back Button */}
        <StyledTouchableOpacity
          onPress={handleBack}
          className="p-3 rounded bg-blue-500 mt-5"
        >
          <StyledText className="text-white text-center font-bold">
            BACK
          </StyledText>
        </StyledTouchableOpacity>
      </ScrollView>
    </StyledView>
  );
};

export default ViewInvoiceDetail;
