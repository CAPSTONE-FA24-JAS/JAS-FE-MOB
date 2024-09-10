import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfileCard from "@/components/Pages/MyProfile/ProfileCard";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { ProfileResponse, UserInfo } from "../types/profilte_type";
import { getProfile } from "@/api/profileApi";
import { logout } from "@/redux/slices/authSlice";

type RootStackParamList = {
  ChangePassword: undefined;
  AccountInfo?: { userData: UserInfo }; // Pass actual user data type here
  Help: undefined;
  Terms: undefined;
  login: undefined;
};

const MyAccount = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const userId = useSelector((state: RootState) => state.auth.userResponse?.id); // Lấy userId từ Redux
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
      // Pass data to AccountInfo screen
      navigation.navigate(screen, { userData: userInfo });
    } else {
      navigation.navigate(screen);
    }
  };

  // Add logout handler
  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigation.navigate("login"); // Navigate to the Login screen
  };

  return (
    <View className="p-4 bg-gray-100 flex-1">
      {/* Profile Card */}
      {userInfo ? (
        <ProfileCard
          userName={userInfo.firstName + " " + userInfo.lastName}
          phoneNumber={userInfo.phoneNumber}
          email={userInfo.email}
          profileImage={
            userInfo.profilePicture
              ? userInfo.profilePicture
              : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Faenza-avatar-default-symbolic.svg/2048px-Faenza-avatar-default-symbolic.svg.png"
          }
          biddingLimit={userInfo.bidLimit ? userInfo.bidLimit : 0}
        />
      ) : (
        <Text>Loading...</Text>
      )}

      {/* Account Options */}
      <View className="mt-4 bg-white rounded-lg shadow">
        <TouchableOpacity
          className="flex-row justify-between items-center p-4 border-b border-gray-200"
          onPress={() => handleNavigation("ChangePassword")}
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="lock-reset" size={20} color="black" />
            <Text className="ml-4 text-lg">Change Password</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color="gray"
            style={{ marginRight: 10 }}
            className=" w-fit float-right"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row justify-between items-center p-4 border-b border-gray-200"
          onPress={() => handleNavigation("AccountInfo")}
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="account" size={20} color="black" />
            <Text className="ml-4 text-lg">Account Info</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color="gray"
            style={{ marginRight: 10 }}
            className=" w-fit float-right"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row justify-between items-center p-4 border-b border-gray-200"
          onPress={() => handleNavigation("Help")}
        >
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
            className=" w-fit float-right"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row justify-between items-center p-4 border-b border-gray-200"
          onPress={() => handleNavigation("Terms")}
        >
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
            className=" w-fit float-right"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center p-4"
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={20} color="black" />
          <Text className="ml-4 text-lg">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyAccount;
