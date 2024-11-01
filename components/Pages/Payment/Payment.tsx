import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import { Asset } from "expo-asset";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import { RadioButton, Appbar, Card, Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Material Icons
import BalanceCard from "../Wallet/component/BalanceCard";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import {
  paymentInvoiceByVnPay,
  paymentInvoiceByWallet,
} from "@/api/invoiceApi";
import { Linking } from "react-native";
import { MyBidData } from "@/app/types/bid_type";
import * as FileSystem from "expo-file-system"; // Import Expo FileSystem
import * as MediaLibrary from "expo-media-library"; // Import Expo MediaLibrary for saving images
import { checkPasswordWallet } from "@/api/walletApi";
import PasswordModal from "./CheckPasswordModal";

// Define the types for navigation routes
type RootStackParamList = {
  PaymentUpload: {
    invoiceId: number;
    itemDetailBid: MyBidData;
    yourMaxBid: number;
  };
  PaymentSuccess: {
    invoiceId?: number;
    itemDetailBid: MyBidData;
    yourMaxBid: number;
  };
  Payment: {
    totalPrice: number;
    invoiceId: number;
    itemDetailBid: MyBidData;
    yourMaxBid: number;
  };
};

const downloadImage = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    // Resolve the URI of the image asset
    const asset = Asset.fromModule(require("../../../assets/icons/qr.jpg"));
    await asset.downloadAsync(); // Ensure the asset is downloaded

    const localUri = FileSystem.documentDirectory + "qr-image.jpg";

    // Copy the asset file to the device's writable directory
    await FileSystem.copyAsync({
      from: asset.localUri || asset.uri,
      to: localUri,
    });

    // Save the copied image to the media library
    await MediaLibrary.createAssetAsync(localUri);
    alert("Image downloaded successfully!");
  } catch (error) {
    console.error("Download error:", error);
    alert("Failed to download image.");
  }
};

// Đường dẫn đến hình ảnh QR trong thư mục dự án
const qrImagePath = require("../../../assets/icons/qr.jpg");

const Payment: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Payment">>();
  const { totalPrice, invoiceId, itemDetailBid, yourMaxBid } = route.params;
  const [passwordModalVisible, setPasswordModalVisible] =
    useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const walletId = useSelector(
    (state: RootState) => state.profile.profile?.customerDTO?.walletDTO?.id
  );
  const [selectedPayment, setSelectedPayment] = useState<string>("wallet");
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(false); // State to handle balance visibility
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // State to handle processing
  // const [isPaymentModalVisible, setIsPaymentModalVisible] =
  //   useState<boolean>(false); // State for modal visibility

  const [isQRModalVisible, setIsQRModalVisible] = useState<boolean>(false);

  console.log("Slected Payment:", selectedPayment);

  const handleDownloadQR = () => {
    // Vì ảnh QR là ảnh cục bộ, chúng ta không cần download từ URL
    alert("Downloading local QR image is not supported directly.");
  };

  const handlePayment = async () => {
    if (selectedPayment === "qr") {
      // Show QR modal
      setIsQRModalVisible(true);
    } else if (selectedPayment === "wallet") {
      // Show password modal
      setPasswordModalVisible(true);
    } else if (selectedPayment === "vnpay") {
      // Existing VNPAY logic
      setIsProcessing(true);

      try {
        const response = await paymentInvoiceByVnPay(invoiceId, totalPrice);

        if (response?.isSuccess) {
          showSuccessMessage(
            response.message || "Payment initiated successfully."
          );

          const paymentUrl = response.data;

          if (paymentUrl) {
            const supported = await Linking.canOpenURL(paymentUrl);
            if (supported) {
              await Linking.openURL(paymentUrl);
              // setIsPaymentModalVisible(true);
            } else {
              showErrorMessage("Failed to open payment URL.");
            }
          } else {
            showErrorMessage("Invalid payment URL.");
          }
        } else {
          showErrorMessage(
            response?.message || "Failed to initiate VNPAY payment."
          );
        }
      } catch (error) {
        showErrorMessage("An error occurred during VNPAY payment.");
        console.error("VNPAY Payment Error:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePasswordConfirm = async (enteredPassword: string) => {
    setPassword(enteredPassword);
    try {
      if (walletId && enteredPassword) {
        const isPasswordCorrect = await checkPasswordWallet(
          walletId,
          enteredPassword
        );

        if (isPasswordCorrect) {
          setPasswordModalVisible(false); // Close password modal
          // Proceed with wallet payment
          setIsProcessing(true);

          try {
            const response = await paymentInvoiceByWallet(
              walletId,
              totalPrice,
              invoiceId
            );

            if (response?.isSuccess) {
              showSuccessMessage(response.message || "Payment successful.");
              navigation.navigate("PaymentSuccess", {
                invoiceId: invoiceId,
                itemDetailBid: itemDetailBid,
                yourMaxBid: yourMaxBid,
              });
            } else {
              showErrorMessage(response?.message || "Payment failed.");
            }
          } catch (error) {
            showErrorMessage("An error occurred during payment.");
            console.error("Payment Error:", error);
          } finally {
            setIsProcessing(false);
          }
        } else {
          showErrorMessage("Incorrect wallet password, please try again.");
        }
      } else {
        showErrorMessage("Wallet ID or password is not available.");
      }
    } catch (error) {
      showErrorMessage("Failed to verify password.");
      console.error("Password Verification Error:", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="font-bold uppercase my-2 text-lg text-gray-600"> Price need pay: {totalPrice?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}</Text>
          {/* Balance */}
          <BalanceCard />

          {/* Choose Payment Method */}
          <Text className="text-lg font-semibold mb-2">
            CHOOSE PAYMENT METHOD
          </Text>

          <RadioButton.Group
            onValueChange={(newValue) => setSelectedPayment(newValue)}
            value={selectedPayment}
          >
            {/* Direct Payment */}
            <Text className="text-base font-medium mb-2 text-gray-700">
              Thanh toán trực tiếp
            </Text>

            <Card className="mb-4 bg-white">
              <TouchableOpacity className="flex-row justify-between items-center p-4">
                <View className="flex-row items-center">
                  <Avatar.Icon icon="wallet" size={40} />
                  <View className="ml-3">
                    <Text className="text-lg font-semibold">MY WALLET</Text>
                    <Text>Thanh toán trực tiếp ví của tôi</Text>
                  </View>
                </View>
                <RadioButton value="wallet" />
              </TouchableOpacity>
            </Card>

            {/* Indirect Payment */}
            <Text className="text-base font-medium mb-2 text-gray-700">
              Thanh toán gián tiếp
            </Text>
            <Text className="text-red-500  font-semibold mb-4">
              Note: Sau khi thanh toán gián tiếp thành công, bạn cần chụp màn
              hình bill chuyển khoản và upload lên lại app JAS. nha
            </Text>

            {/* VNPAY Payment */}
            <Card className="mb-4 bg-white">
              <TouchableOpacity className="flex-row justify-between items-center p-4">
                <View className="flex-row items-center">
                  <Avatar.Image
                    source={require("../../../assets/logo/VNpay_Logo.png")}
                    size={40}
                  />
                  <View className="ml-3">
                    <Text className="text-lg font-semibold">VNPAY</Text>
                    <Text>Tài khoản ví VNPAY</Text>
                  </View>
                </View>
                <RadioButton value="vnpay" />
              </TouchableOpacity>
            </Card>

            {/* Thêm Card QR PAYMENT */}
            <Card className="mb-4 bg-white">
              <TouchableOpacity className="flex-row justify-between items-center p-4">
                <View className="flex-row items-center">
                  <Avatar.Image
                    source={require("../../../assets/icons/qr.jpg")}
                    size={40}
                  />
                  <View className="ml-3">
                    <Text className="text-lg font-semibold">QR PAYMENT</Text>
                    <Text>Thanh toán QR PAYMENT</Text>
                  </View>
                </View>
                <RadioButton value="qr" />
              </TouchableOpacity>
            </Card>
          </RadioButton.Group>
        </View>
      </ScrollView>

      {/* Modal for Payment Confirmation */}
      {/* <Modal
        visible={isPaymentModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="w-4/5 p-4 bg-white rounded-lg">
            <Text className="text-lg font-bold text-center mb-4">
              If you have successfully completed the payment, please take a
              screenshot of the transfer bill and upload the payment photo to
              complete!
            </Text>
            <TouchableOpacity
              className="p-3 rounded bg-green-500 mb-2"
              onPress={() => {
                setIsPaymentModalVisible(false);
                navigation.navigate("PaymentUpload", {
                  invoiceId,
                  itemDetailBid,
                  yourMaxBid,
                });
              }}
            >
              <Text className="text-white text-base text-center font-semibold">
                I have successfully paid
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-3 rounded bg-gray-500 "
              onPress={() => setIsPaymentModalVisible(false)}
            >
              <Text className="text-white text-base  text-center  font-semibold">
                Oops, I haven't paid yet
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

      {/* Modal QR */}
      <Modal
        visible={isQRModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[80%] p-4 bg-white rounded-lg">
            <Text className="font-bold text-xl text-gray-800 text-center uppercase">
              QR PAYMENT WITH{" "}
              {totalPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
            <Image
              source={qrImagePath}
              style={{ width: "100%", height: 400 }}
              resizeMode="contain"
            />
            <TouchableOpacity
              className="p-3 rounded mt-2 bg-blue-500 my-2"
              onPress={() => downloadImage()}
            >
              <Text className="text-white text-center font-semibold">
                Download Image
              </Text>
            </TouchableOpacity>
            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                className="p-3 w-[48%] rounded bg-gray-500"
                onPress={() => setIsQRModalVisible(false)}
              >
                <Text className="text-white text-center uppercase font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3 w-[48%] rounded bg-green-500 my-2"
                onPress={() => {
                  setIsQRModalVisible(false);
                  navigation.navigate("PaymentUpload", {
                    invoiceId,
                    itemDetailBid,
                    yourMaxBid,
                  });
                }}
              >
                <Text className="text-white text-center uppercase font-semibold">
                  I have paid
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <PasswordModal
        isVisible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        onConfirm={handlePasswordConfirm}
        amount={totalPrice}
      />

      {/* Payment Button at the bottom */}
      <View className="absolute bottom-0 w-full p-4 bg-white">
        <TouchableOpacity
          className={`p-3 rounded bg-blue-500 ${
            isProcessing ? "bg-blue-300" : "bg-blue-500"
          }`}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-bold">
              PAYMENT
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payment;
