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
import { AddressListData } from "@/app/types/address_type";
import { MyBidData } from "@/app/types/bid_type";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

type RootStackParamList = {
  InvoiceDetailConfirm: {
    addressData: AddressListData;
    itemDetailBid: MyBidData;
    invoiceId: number;
    yourMaxBid: number;
  };
  EditAddress: undefined;
  Payment: { totalPrice: number; invoiceId: number };
};

const InvoiceDetailConfirm: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<RootStackParamList, "InvoiceDetailConfirm">>();
  const user = useSelector((state: RootState) => state.auth.userResponse);

  // Get the passed parameters from the route
  const { addressData, itemDetailBid, invoiceId, yourMaxBid } = route.params;

  console.log("itemDetailBid IN InvoiceDetailConfirm:", itemDetailBid);

  const [isChecked, setIsChecked] = useState<boolean>(false);
  // Calculate the base price
  const basePrice =
    itemDetailBid?.yourMaxBidPrice ||
    itemDetailBid?.lotDTO?.finalPriceSold ||
    yourMaxBid ||
    0;

  // Calculate the total price
  const totalPrice = basePrice + basePrice * 0.08;
  const handleConfirm = () => {
    navigation.navigate("Payment", {
      totalPrice,
      invoiceId,
    });
  };

  return (
    <StyledView className="flex-1 bg-white p-4">
      <ScrollView>
        {/* Customer Information */}
        <StyledText className="text-lg font-bold mb-2">
          CUSTOMER INFORMATION
        </StyledText>
        <StyledView className="border-t  border-gray-300 py-3 mb-3">
          <View className="flex-row justify-between">
            <StyledText className="text-base mb-1 font-semibold text-gray-600">
              Full Name
            </StyledText>
            <Text className="text-base text-right font-semibold">
              {user?.customerDTO.lastName} {user?.customerDTO.firstName}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <StyledText className="text-base mb-1 font-semibold text-gray-600">
              Phone Number
            </StyledText>
            <Text className="text-base text-right font-semibold">
              {user?.phoneNumber}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <StyledText className="text-base mb-1 font-semibold text-gray-600">
              Email
            </StyledText>
            <Text className="text-base text-right font-semibold">
              {user?.email}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <StyledText className="text-base mb-1 font-semibold text-gray-600">
              Address
            </StyledText>
            <Text className="text-base text-right w-[70%] font-semibold">
              {addressData?.addressLine}
            </Text>
          </View>
        </StyledView>

        {/* Order Information */}
        <StyledText className="text-lg font-bold mt-4 mb-2">
          ORDER INFORMATION
        </StyledText>
        <StyledView className="border-t border-b border-gray-300 py-3 mb-3">
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Invoice Code
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              #{invoiceId}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Lot Code
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              #{itemDetailBid.lotId}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Customer Lot Code
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              #{itemDetailBid.id}
            </StyledText>
          </StyledView>

          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Name production
            </StyledText>
            <StyledText className="text-base w-1/2 text-right font-medium text-gray-600">
              {itemDetailBid.lotDTO.title}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Type of production
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              Chưa cập nhật
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Bid Price
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {(
                itemDetailBid?.yourMaxBidPrice ||
                itemDetailBid?.lotDTO?.finalPriceSold ||
                yourMaxBid
              )?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }) || "0 VND"}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Fee VAT 8%
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {(
                (itemDetailBid?.yourMaxBidPrice ||
                  itemDetailBid?.lotDTO?.finalPriceSold ||
                  yourMaxBid) * 0.08
              ).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }) || "0 VND"}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mt-3">
            <StyledText className="text-lg font-bold">Total</StyledText>
            <StyledText className="text-lg font-bold">
              {(
                (itemDetailBid?.yourMaxBidPrice ||
                  itemDetailBid?.lotDTO?.finalPriceSold ||
                  yourMaxBid) +
                (itemDetailBid?.yourMaxBidPrice ||
                  itemDetailBid?.lotDTO?.finalPriceSold ||
                  yourMaxBid) *
                  0.08
              ).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }) || "0 VND"}
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
    </StyledView>
  );
};

export default InvoiceDetailConfirm;
