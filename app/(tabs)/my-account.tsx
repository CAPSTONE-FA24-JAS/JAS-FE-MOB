import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfileCard from "@/components/Pages/MyProfile/ProfileCard";
import { router, useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { ProfileResponse, UserInfo } from "../types/profilte_type";
import { getProfile } from "@/api/profileApi";
import { logout } from "@/redux/slices/authSlice";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import { checkPasswordWallet } from "@/api/walletApi";
import PasswordModal from "@/components/Pages/Payment/CheckPasswordModal";
import { resetNotifications } from "@/redux/slices/notificationSlice";

type RootStackParamList = {
  ChangePassword: undefined;
  AccountInfo?: { userData: UserInfo }; // Pass actual user data type here
  Help: undefined;
  Terms: undefined;
  login: undefined;
  MyWallet: undefined;
  AddBankAccount: undefined;
};

const MyAccount = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [passwordModalVisible, setPasswordModalVisible] =
    useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const userId = useSelector((state: RootState) => state.auth.userResponse?.id); // Lấy userId từ Redux
  const haveWallet = useSelector(
    (state: RootState) => state?.profile?.profile?.customerDTO?.walletId
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  console.log("haveWalletMyprofile", haveWallet);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) {
        try {
          const profileData: ProfileResponse = await getProfile(userId);
          setUserInfo(profileData.data);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleNavigation = (screen: keyof RootStackParamList) => {
    if (screen === "AccountInfo" && userInfo) {
      navigation.navigate(screen, { userData: userInfo });
    } else if (screen === "MyWallet") {
      if (haveWallet) {
        setPasswordModalVisible(true); // Show password modal before navigating to MyWallet
      } else {
        navigation.navigate(screen);
      }
    } else {
      navigation.navigate(screen);
    }
  };

  // Handle password confirmation
  const handlePasswordConfirm = async (enteredPassword: string) => {
    try {
      if (haveWallet && enteredPassword) {
        // Use enteredPassword directly for verification
        const isPasswordCorrect = await checkPasswordWallet(
          haveWallet,
          enteredPassword
        );

        if (isPasswordCorrect) {
          setPasswordModalVisible(false); // Close password modal
          setPassword(""); // Reset the password state
          navigation.navigate("MyWallet"); // Navigate to MyWallet screen
        } else {
          showErrorMessage("Incorrect wallet password, please try again.");
        }
      } else {
        navigation.navigate("MyWallet");
        // showErrorMessage("Wallet ID is not available.");
      }
    } catch (error) {
      showErrorMessage("Failed to verify password.");
    }
  };

  // Add logout handler
  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    dispatch(resetNotifications()); // Reset notifications on logout

    router.push("/login");
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {/* Profile Card */}
      {userInfo ? (
        <ProfileCard
          userName={
            userInfo.customerDTO.lastName + " " + userInfo.customerDTO.firstName
          }
          phoneNumber={userInfo.phoneNumber}
          email={userInfo.email}
          profileImage={
            userInfo.customerDTO.profilePicture
              ? userInfo.customerDTO.profilePicture
              : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Faenza-avatar-default-symbolic.svg/2048px-Faenza-avatar-default-symbolic.svg.png"
          }
          biddingLimit={
            userInfo.customerDTO.priceLimit
              ? userInfo.customerDTO.priceLimit
              : 0
          }
        />
      ) : (
        <Text>Loading...</Text>
      )}

      {/* Account Options */}
      <View className="mt-4 bg-white rounded-lg shadow">
        <TouchableOpacity
          className="flex-row items-center justify-between p-4 border-b border-gray-200"
          onPress={() => handleNavigation("AccountInfo")}>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="account" size={20} color="black" />
            <Text className="ml-4 text-lg">Account Info</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color="gray"
            style={{ marginRight: 10 }}
            className="float-right w-fit"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-between p-4 border-b border-gray-200"
          onPress={() => handleNavigation("ChangePassword")}>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="lock-reset" size={20} color="black" />
            <Text className="ml-4 text-lg">Change Password</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color="gray"
            style={{ marginRight: 10 }}
            className="float-right w-fit"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-between p-4 border-b border-gray-200"
          onPress={() => handleNavigation("MyWallet")}>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="lock-reset" size={20} color="black" />
            <Text className="ml-4 text-lg">My Wallet</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color="gray"
            style={{ marginRight: 10 }}
            className="float-right w-fit"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-between p-4 border-b border-gray-200"
          onPress={() => handleNavigation("AddBankAccount")}>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="lock-reset" size={20} color="black" />
            <Text className="ml-4 text-lg">Card</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color="gray"
            style={{ marginRight: 10 }}
            className="float-right w-fit"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-between p-4 border-b border-gray-200"
          onPress={() => handleNavigation("Help")}>
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="help-circle"
              size={20}
              color="black"
            />
            <Text className="ml-4 text-lg">Help</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color="gray"
            style={{ marginRight: 10 }}
            className="float-right w-fit"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-between p-4 border-b border-gray-200"
          onPress={() => handleNavigation("Terms")}>
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="file-document"
              size={20}
              color="black"
            />
            <Text className="ml-4 text-lg">Terms and Conditions</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color="gray"
            style={{ marginRight: 10 }}
            className="float-right w-fit"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center p-4"
          onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="black" />
          <Text className="ml-4 text-lg">Log Out</Text>
        </TouchableOpacity>
      </View>
      {/* Password Confirmation Modal */}
      <PasswordModal
        isVisible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        onConfirm={handlePasswordConfirm}
      />
    </View>
  );
};

export default MyAccount;
