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
import { checkPasswordWallet } from "@/api/walletApi";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import PasswordModal from "../Payment/CheckPasswordModal";
import { InvoiceDetailResponse } from "@/app/types/invoice_type";

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
    invoiceDetails: InvoiceDetailResponse;
  };
  EditAddress: undefined;
  Payment: {
    totalPrice: number;
    invoiceId: number;
    itemDetailBid: MyBidData;
    yourMaxBid: number;
    typePage: string;
  };
};

const InvoiceDetailConfirm: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<RootStackParamList, "InvoiceDetailConfirm">>();
  const user = useSelector((state: RootState) => state.auth.userResponse);
  const haveWallet = useSelector(
    (state: RootState) => state?.profile?.profile?.customerDTO?.walletId
  );
  console.log("====================================");
  console.log("haveWallet IN InvoiceDetailConfirm:", haveWallet);
  console.log("====================================");
  // Get the passed parameters from the route
  const { addressData, itemDetailBid, invoiceId, yourMaxBid, invoiceDetails } =
    route.params;

  console.log("itemDetailBid IN InvoiceDetailConfirm:", itemDetailBid);

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [passwordModalVisible, setPasswordModalVisible] =
    useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  // Calculate the total price
  const bidPrice = invoiceDetails?.price || 0;
  const feePrice = invoiceDetails?.free || 0;
  const feeShipping = invoiceDetails.feeShip || 0;
  const totalPrice = invoiceDetails?.totalPrice || 0;
  const deposit = invoiceDetails?.myBidDTO?.lotDTO.deposit || 0;

  console.log("feeShipping IN InvoiceDetailConfirm:", feeShipping);

  // Handle password confirmation
  const handlePasswordConfirm = async (enteredPassword: string) => {
    setPassword(enteredPassword);
    try {
      if (haveWallet && enteredPassword) {
        const isPasswordCorrect = await checkPasswordWallet(
          haveWallet,
          enteredPassword
        );

        if (isPasswordCorrect) {
          setPasswordModalVisible(false); // Close password modal
          // Navigate to Payment screen
          navigation.navigate("Payment", {
            totalPrice,
            invoiceId,
            itemDetailBid,
            yourMaxBid,
            typePage: "InvoiceDetailConfirm",
          });
        } else {
          showErrorMessage("Incorrect wallet password, please try again.");
        }
      } else {
        showErrorMessage("Wallet ID or password is not available.");
      }
    } catch (error) {
      showErrorMessage("Failed to verify password.");
    }
  };

  const handleConfirm = () => {
    navigation.navigate("Payment", {
      totalPrice,
      invoiceId,
      itemDetailBid,
      yourMaxBid,
      typePage: "InvoiceDetailConfirm",
    });
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4 bg-white">
        {/* Customer Information */}
        <StyledText className="mb-2 text-lg font-bold">
          CUSTOMER INFORMATION
        </StyledText>
        <StyledView className="py-3 mb-3 border-t border-gray-300">
          <View className="flex-row justify-between">
            <StyledText className="mb-1 text-base font-semibold text-gray-600">
              Full Name
            </StyledText>
            <Text className="text-base font-semibold text-right">
              {user?.customerDTO.lastName} {user?.customerDTO.firstName}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <StyledText className="mb-1 text-base font-semibold text-gray-600">
              Phone Number
            </StyledText>
            <Text className="text-base font-semibold text-right">
              {user?.phoneNumber}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <StyledText className="mb-1 text-base font-semibold text-gray-600">
              Email
            </StyledText>
            <Text className="text-base font-semibold text-right">
              {user?.email}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <StyledText className="mb-1 text-base font-semibold text-gray-600">
              Address
            </StyledText>
            <Text className="text-base text-right w-[70%] font-semibold">
              {addressData?.addressLine}
              {/* {invoiceDetails?.addressToShip} */}
            </Text>
          </View>
        </StyledView>

        {/* Order Information */}
        <StyledText className="mt-4 mb-2 text-lg font-bold">
          ORDER INFORMATION
        </StyledText>
        <StyledView className="gap-2 py-3 mb-3 border-t border-b border-gray-300">
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
              Name production
            </StyledText>
            <StyledText className="w-1/2 text-base font-medium text-right text-gray-600">
              {itemDetailBid.lotDTO.title}
            </StyledText>
          </StyledView>

          <StyledView className="flex-row justify-between mb-1">
            <StyledText className="text-base font-medium text-gray-600">
              Your Bid Price
            </StyledText>
            <StyledText className="text-base font-medium text-gray-600">
              {(bidPrice && typeof bidPrice === "number"
                ? bidPrice
                : 0
              ).toLocaleString("vi-VN", {
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
              {(feePrice && typeof feePrice === "number"
                ? feePrice
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
              {(invoiceDetails.feeShip &&
              typeof invoiceDetails.feeShip === "number"
                ? invoiceDetails.feeShip
                : 0
              ).toLocaleString("vi-VN", {
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
              -{" "}
              {(deposit && typeof deposit === "number"
                ? deposit
                : 0
              ).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }) || "0 VND"}
            </StyledText>
          </StyledView>

          <StyledView className="flex-row justify-between mt-3">
            <StyledText className="text-lg font-bold">Total</StyledText>
            <StyledText className="text-lg font-bold">
              {totalPrice
                ? totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                : "0 VND"}
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
        <StyledView className="border-t border-gray-200 py-14 ">
          <StyledTouchableOpacity
            disabled={!isChecked}
            onPress={handleConfirm}
            className={`p-3 rounded ${
              isChecked ? "bg-blue-500" : "bg-gray-300"
            }`}>
            <StyledText className="font-bold text-center text-white">
              CONFIRM
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </ScrollView>
      {/* Password Confirmation Modal */}
      <PasswordModal
        isVisible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        onConfirm={handlePasswordConfirm}
        amount={totalPrice}
      />
    </View>
  );
};

export default InvoiceDetailConfirm;
