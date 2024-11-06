// ViewInvoiceDetail.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { styled } from "nativewind";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AddressListData } from "@/app/types/address_type";
import { MyBidData } from "@/app/types/bid_type";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ImageGallery from "@/components/ImageGallery";
import ImageGalleryOne from "@/components/ImageGalleryOne";
import { InvoiceDetailResponse } from "@/app/types/invoice_type";

type RootStackParamList = {
  InvoiceDetail: {
    addressData: AddressListData;
    itemDetailBid: MyBidData;
    invoiceId: number;
    yourMaxBid: number;
    imagePayment: string;
    invoiceDetails: InvoiceDetailResponse;
  };
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ViewInvoiceDetail: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "InvoiceDetail">>();
  const user = useSelector((state: RootState) => state.auth.userResponse);

  // Destructure the passed parameters
  const {
    addressData,
    itemDetailBid,
    invoiceId,
    yourMaxBid,
    imagePayment,
    invoiceDetails,
  } = route.params;

  // Calculate the total price
  const bidPrice = invoiceDetails?.price || 0;
  const feePrice = invoiceDetails?.free || 0;
  const feeShipping = invoiceDetails?.feeShip || 0;
  const totalPrice = invoiceDetails?.totalPrice || 0;

  // Handle back button
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <StyledView className="flex-1 bg-white p-4">
      <ScrollView>
        {/* Customer Information */}

        <StyledText className="text-lg font-bold mb-2">
          CUSTOMER INFORMATION
        </StyledText>

        <StyledView className="border-t border-gray-300 py-3 mb-3">
          <View className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Full Name
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {user?.customerDTO.lastName} {user?.customerDTO.firstName}
            </StyledText>
          </View>

          <View className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Phone Number
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {user?.phoneNumber}
            </StyledText>
          </View>

          <View className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Email
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {user?.email}
            </StyledText>
          </View>

          <View className="flex-row justify-between">
            <StyledText className="text-base font-medium text-gray-600">
              Address
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600 w-[70%] text-right">
              {addressData?.addressLine || "No Address"}
            </StyledText>
          </View>
        </StyledView>

        {/* Order Information */}
        <StyledText className="text-lg font-bold mt-4 mb-2">
          ORDER INFORMATION
        </StyledText>
        <StyledView className="border-t  border-gray-300 py-3 mb-3">
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
              Name Production
            </StyledText>
            <StyledText className="text-base w-1/2 text-right font-medium text-gray-600">
              {itemDetailBid.lotDTO.title}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Type of Production
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {itemDetailBid.lotDTO.lotType || "Not Updated"}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Your Bid Price
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {bidPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }) || "0 VND"}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Platform Fee
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {feePrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }) || "0 VND"}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Shipping Fee
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {feeShipping.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }) || "0 VND"}
            </StyledText>
          </StyledView>

          <StyledView className="flex-row justify-between mt-3">
            <StyledText className="text-lg font-bold">Total</StyledText>
            <StyledText className="text-lg font-bold">
              {totalPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </StyledText>
          </StyledView>
        </StyledView>

        {imagePayment && (
          <View className="mt-2 mb-4">
            <StyledText className="text-lg uppercase font-bold mb-2">
              Bill Payment Image
            </StyledText>
            <View className="border-t border-gray-300">
              <ImageGalleryOne image={imagePayment} />
            </View>
          </View>
        )}
        {/* Payment Section */}
        <StyledView className="flex-row justify-center mt-3">
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
