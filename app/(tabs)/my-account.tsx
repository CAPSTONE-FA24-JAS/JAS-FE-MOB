import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfileCard from "@/components/Pages/MyProfile/ProfileCard";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
// import ProfileCard from "./components/ProfileCard";

// Mock User Data
const mockUserData = {
  userName: "John Doe",
  phoneNumber: "+1 (555) 123-4567",
  email: "john.doe@example.com",
  biddingLimit: 5000000000,
  profileImage:
    "https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2218", // Example image URL
};

type RootStackParamList = {
  ChangePassword: undefined;
  AccountInfo: { userData: typeof mockUserData };
  Help: undefined;
  Terms: undefined;
};

const MyAccount = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleNavigation = (screen: keyof RootStackParamList) => {
    if (screen === "AccountInfo") {
      // Pass data to AccountInfo screen
      navigation.navigate(screen, { userData: mockUserData });
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <View className="p-4 bg-gray-100 flex-1">
      {/* Profile Card */}
      <ProfileCard
        userName={mockUserData.userName}
        phoneNumber={mockUserData.phoneNumber}
        email={mockUserData.email}
        profileImage={mockUserData.profileImage}
        biddingLimit={mockUserData.biddingLimit}
      />

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
          // onPress={() => handleNavigation("Logout")}
        >
          <MaterialCommunityIcons name="logout" size={20} color="black" />
          <Text className="ml-4 text-lg">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyAccount;
