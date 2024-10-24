import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import BalanceCard from "./component/BalanceCard";
import TransactionButton from "./component/TransactionButton";
import InfoCard from "./component/InfoCard";
import TransactionHistory from "./component/TransactionHistory";
import { useDispatch, useSelector } from "react-redux";
import store, { RootState, useAppDispatch } from "@/redux/store";
import { Text } from "react-native";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { checkWalletBalance, createWallet } from "@/api/walletApi";
import { fetchProfile } from "@/redux/slices/profileSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MyWalletMain: React.FC = () => {
  const [loading, setLoading] = useState(false);
  // State for Modal
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(true);
  const [rightIcon, setRightIcon] = useState<"eye" | "eye-off">("eye");
  const [confirmRightIcon, setConfirmRightIcon] = useState<"eye" | "eye-off">(
    "eye"
  );
  const dispatch = useAppDispatch();
  const accountId = useSelector(
    (state: RootState) => state.auth.userResponse?.id
  );
  const userId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.id
  );
  const IdWallet = useSelector(
    (state: RootState) => state?.profile?.profile?.customerDTO?.walletId
  );

  console.log("Wallet id:", JSON.stringify(IdWallet));
  console.log("Account ID:", accountId);
  console.log("User ID:", userId);

  //  useEffect(() => {
  //   const fetchData = async () => {
  //     if (haveWallet) {
  //       await getWalletBalance(haveWallet);
  //     }
  //   };

  //   fetchData();
  // }, [haveWallet]);

  // const getWalletBalance = async (walletId: number) => {
  //   try {
  //     const response = await checkWalletBalance(walletId);
  //     if (response && response.isSuccess) {
  //       setBalance(response.data.balance);
  //       showSuccessMessage("Wallet balance retrieved successfully.");
  //     } else {
  //       setBalance(null); // Set null if response fails
  //     }
  //   } catch (error) {
  //     showErrorMessage("Failed to retrieve wallet balance.");
  //   }
  // };

  const handlePasswordVisibility = () => {
    setRightIcon(rightIcon === "eye" ? "eye-off" : "eye");
    setPasswordVisibility(!passwordVisibility);
  };

  const handleConfirmPasswordVisibility = () => {
    setConfirmRightIcon(confirmRightIcon === "eye" ? "eye-off" : "eye");
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };

  const handleCreateWallet = () => {
    setIsPasswordModalVisible(true); // Show the modal for password input
  };

  const handleConfirmCreateWallet = async () => {
    // Validate passwords
    if (!password || !confirmPassword) {
      showErrorMessage("Please enter and confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      showErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    if (password.length < 4) {
      showErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (userId === undefined) {
      showErrorMessage("User ID is undefined. Cannot create wallet.");
      return;
    }

    try {
      setLoading(true);
      const response = await createWallet(userId, password);
      console.log("responseCreateWallet", response);

      if (response && response.isSuccess) {
        showSuccessMessage("Wallet created successfully.");
        setIsPasswordModalVisible(false); // Close modal after success
        setPassword("");
        setConfirmPassword("");
        if (accountId) dispatch(fetchProfile(accountId));
      }
    } catch (error) {
      showErrorMessage("Failed to create wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!IdWallet ? (
        <View className="flex-1 bg-white justify-center pb-10 px-6 items-center">
          <Text className="text-lg text-center text-gray-500">
            You don't have a wallet yet. Do you want to create your Wallet?
            Click the button below!
          </Text>
          <TouchableOpacity
            onPress={handleCreateWallet}
            className={`bg-blue-500 py-2 px-4 mt-4 rounded-lg ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-white font-bold text-xl uppercase">
                Create Wallet
              </Text>
            )}
          </TouchableOpacity>

          {/* Modal for password input */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={isPasswordModalVisible}
            onRequestClose={() => setIsPasswordModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="w-10/12 p-6 bg-white rounded-lg relative">
                {/* Close icon at the top-right corner */}
                <TouchableOpacity
                  className="absolute top-2 right-2"
                  onPress={() => setIsPasswordModalVisible(false)}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>

                <Text className="mb-4 text-lg font-semibold text-center uppercase">
                  Create Wallet Password
                </Text>

                {/* Password Input */}
                <View className="relative mr-4 mb-4 mt-4 border-[1px] w-full border-slate-300 p-2 rounded-lg">
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
                    <MaterialCommunityIcons
                      name={rightIcon}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password Input */}
                <View className="relative mr-4 mb-6 border-[1px] w-full border-slate-300 p-2 rounded-lg">
                  <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={confirmPasswordVisibility}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    className="py-2 text-lg ml-2 text-slate-400"
                    style={{ paddingRight: 40 }}
                  />
                  <TouchableOpacity
                    onPress={handleConfirmPasswordVisibility}
                    className="absolute right-4 top-[40%] transform -translate-y-1/2"
                  >
                    <MaterialCommunityIcons
                      name={confirmRightIcon}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm Button */}
                <TouchableOpacity
                  className={`w-full bg-[#4765F9] rounded-md ${
                    loading ? "opacity-50" : ""
                  }`}
                  onPress={handleConfirmCreateWallet}
                  disabled={loading}
                >
                  <Text className="py-3 text-xl font-semibold text-center text-white uppercase">
                    {loading ? "Creating..." : "Confirm"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <ScrollView className="bg-white flex-1 p-2">
          {/* Balance */}
          <BalanceCard />
          {/* Transaction Buttons */}

          {/* Transaction Buttons */}
          <View className="flex-row justify-around mb-4">
            <TransactionButton title="Deposit" icon="deposit" />
            <TransactionButton title="Withdraw" icon="withdraw" />
          </View>

          {/* Info Cards */}
          <InfoCard />

          {/* Transaction History */}
          <TransactionHistory />
        </ScrollView>
      )}
    </>
  );
};

export default MyWalletMain;
