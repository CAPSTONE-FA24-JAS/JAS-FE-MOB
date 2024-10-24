import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
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
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

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
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState<"eye" | "eye-off">("eye");
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

  const handlePasswordVisibility = () => {
    setRightIcon(rightIcon === "eye" ? "eye-off" : "eye");
    setPasswordVisibility(!passwordVisibility);
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

  const handleConfirmPassword = async () => {
    try {
      if (typeof haveWallet === "number" && userId) {
        const isPasswordCorrect = await checkPasswordWallet(
          haveWallet,
          password
        );
        if (isPasswordCorrect) {
          try {
            await registerToBid(lotDetail.deposit, userId, lotDetail.id);
            showSuccessMessage("Registered to bid successfully.");
            setIsPasswordModalVisible(false);
            navigation.navigate("RisingBidPage", { itemId: 49 });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            if (
              errorMessage ===
              "Customer haven't bidlimt, please regiser new bidlimit before join to lot"
            ) {
              setIsPasswordModalVisible(false); // Close the password modal
              setIsDepositModalVisible(true); // Show the deposit prompt modal
            } else {
              showErrorMessage(errorMessage || "Failed to register to bid.");
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
        disabled={!checkedTerms || !checkedAge}
      >
        <Text className="font-semibold text-center text-white">
          REGISTER TO BID
        </Text>
      </TouchableOpacity>

      {/* Modal for password input */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPasswordModalVisible}
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View className="items-center justify-center flex-1 bg-black/50">
          <View className="items-center w-10/12 p-6 bg-white rounded-lg">
            {/* Close icon at the top-right corner */}
            <TouchableOpacity
              className="absolute top-2 right-2"
              onPress={() => setIsPasswordModalVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text className="mb-4 text-lg font-semibold text-center uppercase">
              Enter Wallet Password
            </Text>

            <View className="relative mx-4 mb-6 mt-4 border-[1px] w-full border-slate-300 p-2 rounded-lg">
              <TextInput
                placeholder="Password"
                secureTextEntry={passwordVisibility}
                value={password}
                onChangeText={setPassword}
                className="py-2 text-lg ml-2 text-slate-400"
                style={{ paddingRight: 40 }}
              />
              <TouchableOpacity
                onPress={handlePasswordVisibility}
                className="absolute right-4 top-[40%] transform -translate-y-1/2"
              >
                <Feather name={rightIcon} size={24} color="black" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="w-full bg-[#4765F9] rounded-md"
              onPress={handleConfirmPassword}
            >
              <Text className="py-3 text-xl font-semibold text-center text-white uppercase">
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal for Deposit Prompt */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDepositModalVisible}
        onRequestClose={() => setIsDepositModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-10/12 p-6 bg-white rounded-lg relative">
            {/* Close icon at the top-right corner */}
            <TouchableOpacity
              className="absolute top-2 right-2"
              onPress={() => setIsDepositModalVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text className="mb-4 text-lg font-semibold text-center">
              You need to deposit more money into the wallet to continue.
            </Text>

            {/* Deposit Button */}
            <TouchableOpacity
              className="w-full bg-blue-500 py-2 px-4 rounded-lg"
              onPress={navigateToDeposit}
            >
              <Text className="text-white font-bold text-xl uppercase text-center">
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
