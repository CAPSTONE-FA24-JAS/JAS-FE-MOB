import {
  paymentInvoiceByBankTransfer,
  paymentInvoiceByVnPay,
  paymentInvoiceByWallet,
} from "@/api/invoiceApi";
import { checkPasswordWallet } from "@/api/walletApi";
import { MyBidData } from "@/app/types/bid_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { RootState } from "@/redux/store";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system"; // Import Expo FileSystem
import * as MediaLibrary from "expo-media-library"; // Import Expo MediaLibrary for saving images
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Card, RadioButton } from "react-native-paper";
import { useSelector } from "react-redux";
import BalanceCard from "../Wallet/component/BalanceCard";
import PasswordModal from "./CheckPasswordModal";

// Define the types for navigation routes
type RootStackParamList = {
  PaymentUpload: {
    invoiceId: number;
    itemDetailBid: MyBidData;
    yourMaxBid: number;
    totalPrice: number;
  };
  PaymentSuccess: {
    invoiceId?: number;
    itemDetailBid: MyBidData;
    yourMaxBid: number;
    totalPrice: number;
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
  const cusid =
    useSelector(
      (state: RootState) => state.auth.userResponse?.customerDTO.id
    ) ?? 0;
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
      // Xử lý thanh toán qua QR
      setIsProcessing(true); // Hiển thị trạng thái đang xử lý
      try {
        const response = await paymentInvoiceByBankTransfer(
          invoiceId,
          totalPrice
        );

        if (response?.isSuccess) {
          // Hiển thị modal QR nếu API thành công
          showSuccessMessage(
            response.message || "QR payment initiated successfully."
          );
          setIsQRModalVisible(true);
        } else {
          // Hiển thị lỗi nếu API trả về lỗi
          showErrorMessage(
            response?.message || "Failed to initiate QR payment."
          );
        }
      } catch (error) {
        // Xử lý lỗi khi gọi API thất bại
        showErrorMessage("An error occurred during QR payment.");
        console.error("QR Payment Error:", error);
      } finally {
        setIsProcessing(false); // Tắt trạng thái đang xử lý
      }
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
              invoiceId,
              cusid
            );

            if (response?.isSuccess) {
              showSuccessMessage(response.message || "Payment successful.");
              navigation.navigate("PaymentSuccess", {
                invoiceId: invoiceId,
                itemDetailBid: itemDetailBid,
                yourMaxBid: yourMaxBid,
                totalPrice: totalPrice,
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
      <ScrollView className="flex-1 mb-20">
        <View className="p-2 mx-2">
          <Text className="my-2 text-lg font-bold text-gray-600 uppercase">
            Price need pay:{" "}
            {(totalPrice ? totalPrice : 0).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
          {/* Balance */}
          <BalanceCard />

          {/* Choose Payment Method */}
          <Text className="mb-2 text-lg font-semibold">
            CHOOSE PAYMENT METHOD
          </Text>

          <RadioButton.Group
            onValueChange={(newValue) => setSelectedPayment(newValue)}
            value={selectedPayment}>
            <Card className="mb-4 bg-white">
              <TouchableOpacity className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center">
                  <Avatar.Icon icon="wallet" size={40} />
                  <View className="ml-3">
                    <Text className="text-lg font-semibold">MY WALLET</Text>
                    <Text>Payment by Wallet</Text>
                  </View>
                </View>
                <RadioButton value="wallet" />
              </TouchableOpacity>
            </Card>

            {/* VNPAY Payment */}
            <Card className="mb-4 bg-white">
              <TouchableOpacity className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center">
                  <Avatar.Image
                    source={require("../../../assets/logo/VNpay_Logo.png")}
                    size={40}
                  />
                  <View className="ml-3">
                    <Text className="text-lg font-semibold">VNPAY</Text>
                    <Text>VNPAY</Text>
                  </View>
                </View>
                <RadioButton value="vnpay" />
              </TouchableOpacity>
            </Card>
            {/* Indirect Payment */}
            <Text className="mx-2 mb-2 text-sm font-medium text-gray-700">
              Indirect Payment
            </Text>
            <Text className="mx-2 mb-2 font-semibold text-red-500 ">
              Note: After successful indirect payment, please take a screenshot
              of the transfer receipt and upload it to the app.
            </Text>

            {/* Thêm Card QR PAYMENT */}
            <Card className="mb-4 bg-white">
              <TouchableOpacity className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center">
                  <Avatar.Image
                    source={require("../../../assets/icons/qr.jpg")}
                    size={40}
                  />
                  <View className="ml-3">
                    <Text className="text-lg font-semibold">QR PAYMENT</Text>
                    <Text>QR PAYMENT</Text>
                  </View>
                </View>
                <RadioButton value="qr" />
              </TouchableOpacity>
            </Card>
          </RadioButton.Group>
        </View>
      </ScrollView>

      {/* Modal QR */}
      <Modal
        visible={isQRModalVisible}
        transparent={true}
        animationType="slide">
        <View className="items-center justify-center flex-1 bg-black/50">
          <View className="w-[80%] p-4 bg-white rounded-lg">
            <Text className="text-xl font-bold text-center text-gray-800 uppercase">
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
              className="p-3 my-2 mt-2 bg-blue-500 rounded"
              onPress={() => downloadImage()}>
              <Text className="font-semibold text-center text-white">
                Download Image
              </Text>
            </TouchableOpacity>
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                className="p-3 w-[48%] rounded bg-gray-500"
                onPress={() => setIsQRModalVisible(false)}>
                <Text className="font-semibold text-center text-white uppercase">
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
                    totalPrice,
                  });
                }}>
                <Text className="font-semibold text-center text-white uppercase">
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
          disabled={isProcessing}>
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-lg font-bold text-center text-white">
              PAYMENT
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payment;
