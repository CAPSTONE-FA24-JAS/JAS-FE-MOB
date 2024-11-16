import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import BalanceCard from "../Wallet/component/BalanceCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { checkPasswordWallet, checkWalletBalance } from "@/api/walletApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { LotDetail } from "@/app/types/lot_type";
import { registerToBid } from "@/api/lotAPI";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import PasswordModal from "../Payment/CheckPasswordModal";
import { ApiError } from "@/api/utils/ApiError";

type RootStackParamList = {
  [x: string]: any;
};

const RegisterToBid = () => {
  const route = useRoute();
  const lotDetail = route.params as LotDetail;
  console.log("lotDetail", lotDetail);

  const navigation = useNavigation<RootStackParamList>();
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [checkedAge, setCheckedAge] = useState(false);
  const [balance, setBalance] = useState<number | null>(null); // Store balance here

  const [password, setPassword] = useState<string>("");
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);

  const userId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.id
  );
  const haveWallet = useSelector(
    (state: RootState) => state?.profile?.profile?.customerDTO?.walletId
  );

  console.log("accountIdNe", userId);
  console.log("balanceNe", balance);
  console.log("haveWalletNE", haveWallet);

  useEffect(() => {
    const fetchData = async () => {
      if (haveWallet) {
        await getWalletBalance(haveWallet); // Fetch balance
      }
    };

    fetchData();
  }, [haveWallet]);

  const getWalletBalance = async (walletId: number) => {
    try {
      const response = await checkWalletBalance(walletId);
      if (response && response.isSuccess) {
        setBalance(response.data.balance);
        showSuccessMessage("Check Wallet balance retrieved successfully.");
      } else {
        setBalance(null); // Set null if response fails
      }
    } catch (error) {
      showErrorMessage("Failed to retrieve wallet balance.");
    }
  };

  const handleRegisterToBid = async () => {
    if (!userId) {
      showErrorMessage("User ID is not available.");
      return;
    }

    if (balance && balance < lotDetail.deposit) {
      showErrorMessage("Insufficient balance.");
      return;
    }

    setIsPasswordModalVisible(true); // Show the modal for password input
  };

  const handleConfirmPassword = async (enteredPassword: string) => {
    setPassword(enteredPassword);
    try {
      console.log("passwordNHAAA", password);
      if (haveWallet && enteredPassword) {
        const isPasswordCorrect = await checkPasswordWallet(
          haveWallet,
          enteredPassword
        );
        if (isPasswordCorrect && userId) {
          setIsPasswordModalVisible(false); // Close the password modal
          try {
            await registerToBid(lotDetail.deposit, userId, lotDetail.id);
            showSuccessMessage("Registered to bid successfully.");
            if (lotDetail.status === "Auctioning") {
              if (lotDetail.lotType === "Public_Auction") {
                navigation.replace("RisingBidPage", { itemId: lotDetail.id }); // lot id
              }
              if (lotDetail.lotType === "Auction_Price_GraduallyReduced") {
                navigation.replace("ReduceBidPage", { itemId: lotDetail.id });
              }
            }

            if (lotDetail.status !== "Auctioning") {
              navigation.replace("LotDetail", { itemId: lotDetail.id });
            }
          } catch (error: any) {
            if (error instanceof ApiError) {
              if (error.code === 400) {
                // Show React Native Alert for 400 errors
                Alert.alert("Error", error.message);
              } else if (
                error.message ===
                "Customer haven't bidlimt, please register new bidlimit before join to lot"
              ) {
                setIsDepositModalVisible(true); // Show the deposit prompt modal
              } else {
                showErrorMessage(error.message || "Failed to register to bid.");
              }
            } else {
              // Handle other types of errors
              showErrorMessage("An unexpected error occurred.");
            }
          }
        } else {
          showErrorMessage("Incorrect wallet password, please try again.");
        }
      } else {
        showErrorMessage("Wallet ID or userId is not available.");
      }
    } catch (error) {
      showErrorMessage("Failed to check password.");
    }
  };

  const navigateToDeposit = () => {
    setIsDepositModalVisible(false); // Close the deposit prompt modal
    navigation.navigate("Deposit"); // Navigate to the Deposit screen
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {/* Hiển thị số dư hiện tại */}

      <BalanceCard />

      {/* Thông tin đặt cọc */}
      <View className="p-4 border rounded-lg">
        <Text className="mb-4 text-lg font-bold">DEPOSIT INFORMATION</Text>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold text-gray-500">
            Auction Name
          </Text>
          <Text className="text-base w-[60%] text-gray-700 font-semibold">
            {lotDetail?.auction?.name || "N/A"}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold text-gray-500">
            Lot Name
          </Text>
          <Text className="text-base w-[60%] text-gray-700 font-semibold">
            {lotDetail?.jewelry?.name || "N/A"}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold text-gray-500">
            Deposit Fee
          </Text>
          <Text className="text-base w-[60%] text-gray-700 font-semibold">
            {lotDetail?.deposit.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            }) || 0}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold text-gray-500">
            New Balance
          </Text>
          <Text className="text-base w-[60%] text-gray-700 font-semibold">
            {balance && balance > lotDetail.deposit
              ? `${balance - lotDetail.deposit} VND`
              : "N/A Or Insufficient balance"}
          </Text>
        </View>

        <View className="my-2 border-t" />

        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold text-gray-500">
            Transaction Fees
          </Text>
          <Text className="text-base w-[60%] text-gray-700 font-semibold">
            Free
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base font-semibold text-gray-500">
            Transaction Code
          </Text>
          <Text className="text-base w-[60%] text-gray-700 font-semibold">
            #1234567
          </Text>
        </View>
      </View>

      {/* Điều khoản và điều kiện */}
      <View className="mt-4">
        <View className="flex-row items-center mb-2">
          <Checkbox
            status={checkedTerms ? "checked" : "unchecked"}
            onPress={() => setCheckedTerms(!checkedTerms)}
          />
          <Text className="ml-2 text-base">
            I have read and agree to the{" "}
            <Text className="text-blue-500">Terms of Use</Text> and{" "}
            <Text className="text-blue-500">Privacy Policy</Text>.
          </Text>
        </View>

        <View className="flex-row items-center mb-4">
          <Checkbox
            status={checkedAge ? "checked" : "unchecked"}
            onPress={() => setCheckedAge(!checkedAge)}
          />
          <Text className="ml-2 text-base">I am 18 years of age or older</Text>
        </View>
      </View>

      <TouchableOpacity
        className="py-3 bg-blue-500 rounded-sm"
        onPress={handleRegisterToBid}
        disabled={!checkedTerms || !checkedAge}>
        <Text className="font-semibold text-center text-white">
          REGISTER TO BID
        </Text>
      </TouchableOpacity>

      {/* Use the PasswordModal here */}
      <PasswordModal
        isVisible={isPasswordModalVisible}
        onClose={() => setIsPasswordModalVisible(false)}
        onConfirm={handleConfirmPassword}
        amount={lotDetail.deposit}
      />
      {/* Modal for Deposit Prompt */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDepositModalVisible}
        onRequestClose={() => setIsDepositModalVisible(false)}>
        <View className="items-center justify-center flex-1 bg-black/50">
          <View className="relative w-10/12 p-6 bg-white rounded-lg">
            {/* Close icon at the top-right corner */}
            <TouchableOpacity
              className="absolute top-2 right-2"
              onPress={() => setIsDepositModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text className="mb-4 text-lg font-semibold text-center">
              You need to deposit more money into the wallet to continue.
            </Text>

            {/* Deposit Button */}
            <TouchableOpacity
              className="w-full px-4 py-2 bg-blue-500 rounded-lg"
              onPress={navigateToDeposit}>
              <Text className="text-xl font-bold text-center text-white uppercase">
                Deposit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default RegisterToBid;
