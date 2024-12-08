// ViewInvoiceDetail.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AddressListData } from "@/app/types/address_type";
import { MyBidData } from "@/app/types/bid_type";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ImageGalleryOne from "@/components/ImageGalleryOne";
import { InvoiceDetailResponse } from "@/app/types/invoice_type";

type RootStackParamList = {
  InvoiceDetail: {
    addressData?: AddressListData;
    itemDetailBid?: MyBidData;
    invoiceId?: number;
    yourMaxBid?: number;
    imagePayment?: string;
    invoiceDetails?: InvoiceDetailResponse;
    idNoti?: number;
  };
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ViewInvoiceDetail: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "InvoiceDetail">>();

  const user = useSelector((state: RootState) => state.auth.userResponse);

  let notificationId: number | undefined;
  try {
    const notificationRoute =
      useRoute<RouteProp<RootStackParamList, "InvoiceDetail">>();
    notificationId = notificationRoute.params?.idNoti;
    console.log("Notification ID:", notificationId);
  } catch (error) {
    // If there's an error accessing notification params, it means we weren't navigated from notifications
    console.log("Not navigated from notifications");
  }

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
  const deposit = invoiceDetails?.myBidDTO?.lotDTO.deposit || 0;

  // Handle back button
  const handleBack = () => {
    navigation.goBack();
  };

  console.log("invoiceDetailsView", JSON.stringify(invoiceDetails, null, 2));

  return (
    <StyledView className="flex-1 p-4 bg-white">
      <ScrollView>
        {/* Customer Information */}

        <StyledText className="mb-2 text-lg font-bold">
          CUSTOMER INFORMATION
        </StyledText>

        <StyledView className="py-3 mb-3 border-t border-gray-300">
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
              {addressData?.addressLine ?? invoiceDetails?.addressToShip}
            </StyledText>
          </View>
        </StyledView>

        {/* Order Information */}
        <StyledText className="mt-4 mb-2 text-lg font-bold">
          ORDER INFORMATION
        </StyledText>
        <StyledView className="py-3 mb-3 border-t border-gray-300">
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
              #{itemDetailBid?.lotId}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Customer Lot Code
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              #{itemDetailBid?.id}
            </StyledText>
          </StyledView>

          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Name Production
            </StyledText>
            <StyledText className="w-1/2 text-base font-medium text-right text-gray-600">
              {itemDetailBid?.lotDTO.title}
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
              Deposit:
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {(deposit && typeof deposit === "number"
                ? deposit
                : 0
              ).toLocaleString("vi-VN", {
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

        {imagePayment && invoiceDetails?.myBidDTO?.status !== "Cancelled" && (
          <View className="mt-2 mb-4">
            <StyledText className="mb-2 text-lg font-bold uppercase">
              Bill Payment Image
            </StyledText>
            <View className="border-t border-gray-300">
              <ImageGalleryOne image={imagePayment} />
            </View>
          </View>
        )}
        {/* Payment Section */}
        {invoiceDetails?.myBidDTO?.status !== "Cancelled" ? (
          <StyledView className="flex-row justify-center mt-3">
            <StyledText className="text-xl font-bold text-green-500">
              PAYMENT
            </StyledText>
          </StyledView>
        ) : (
          <StyledView className="flex-row justify-center mt-3">
            <StyledText className="text-xl font-bold text-red-500">
              CANCELLED
            </StyledText>
          </StyledView>
        )}

        {/* Back Button */}
        <StyledTouchableOpacity
          onPress={handleBack}
          className="p-3 mt-5 bg-blue-500 rounded"
        >
          <StyledText className="font-bold text-center text-white">
            BACK
          </StyledText>
        </StyledTouchableOpacity>
      </ScrollView>
    </StyledView>
  );
};

export default ViewInvoiceDetail;
