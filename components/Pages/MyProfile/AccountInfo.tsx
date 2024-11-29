import React, { useState } from "react";
import { View, TextInput, Image, TouchableOpacity, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome"; // Using FontAwesome for camera icon
import { deleteAccount } from "@/api/profileApi";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "@/components/Modal/ConfirmModalProps ";
import { logout } from "@/redux/slices/authSlice";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserInfo } from "@/app/types/profilte_type";
import { resetNotifications } from "@/redux/slices/notificationSlice";

type RouteParams = {
  userData: UserInfo;
};
type RootStackParamList = {
  login: undefined;
};

const AccountInfo: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.userResponse?.id); // Lấy userId từ Redux
  const dispatch = useDispatch(); // Get the Redux dispatch function
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { userData } = route.params as RouteParams;

  // State to hold the editable data
  const [profile, setProfile] = useState({
    firstName: userData.customerDTO.firstName,
    lastName: userData.customerDTO.lastName,
    phoneNumber: userData.phoneNumber,
    email: userData.email,
    biddingLimit: userData.customerDTO?.priceLimit ?? 0,
    profileImage:
      userData.customerDTO.profilePicture ??
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Faenza-avatar-default-symbolic.svg/2048px-Faenza-avatar-default-symbolic.svg.png",
  });
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);

  // Function to toggle modal visibility
  const toggleConfirmModal = () => {
    setConfirmModalVisible(!isConfirmModalVisible);
  };
  // Handle input change
  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  // Handle profile image change (You would trigger image picker here)
  const handleChangeProfileImage = () => {
    // Placeholder function for changing profile image
    console.log("Change profile image");
  };

  // Handle delete account
  // Handle delete account
  const handleDeleteAccount = async () => {
    if (!userId) return;
    try {
      await deleteAccount(userId);
      // Trigger logout
      setConfirmModalVisible(false); // Close the modal
      dispatch(logout()); // Dispatch the logout action to log out the user
      dispatch(resetNotifications()); // Reset notifications on logout
      navigation.navigate("login"); // Navigate to login screen
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <View>
        {/* Profile Image with Camera Icon */}
        <View className="relative mx-auto mb-4">
          <Image
            source={{ uri: profile.profileImage }}
            className="w-32 h-32 rounded-full"
          />

          {/* Camera Icon positioned at bottom-left */}
          <TouchableOpacity
            className="absolute bottom-0 left-0 p-2 bg-gray-300 rounded-full"
            onPress={handleChangeProfileImage}
          >
            <Icon name="camera" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Editable Inputs for Profile Data */}
        <TextInput
          value={profile.firstName}
          onChangeText={(value) => handleChange("firstName", value)}
          placeholder="Enter your first name"
          className="p-2 mb-4 border-b border-gray-400"
        />
        <TextInput
          value={profile.lastName}
          onChangeText={(value) => handleChange("lastName", value)}
          placeholder="Enter your last name"
          className="p-2 mb-4 border-b border-gray-400"
          returnKeyType="done"
        />
        <TextInput
          value={profile.phoneNumber}
          onChangeText={(value) => handleChange("phoneNumber", value)}
          placeholder="Enter your phone number"
          className="p-2 mb-4 border-b border-gray-400"
          returnKeyType="done"
        />
        <TextInput
          value={profile.email}
          onChangeText={(value) => handleChange("email", value)}
          placeholder="Enter your email"
          className="p-2 mb-4 border-b border-gray-400"
          returnKeyType="done"
        />

        {/* Save Button */}
        <TouchableOpacity className="p-3 mt-4 bg-blue-500 rounded-lg">
          <Text className="text-lg font-semibold text-center text-white uppercase">
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          className="p-3 mt-4 bg-red-500 rounded-lg"
          onPress={toggleConfirmModal}
        >
          <Text className="text-lg font-semibold text-center text-white uppercase">
            Delete My Account
          </Text>
        </TouchableOpacity>
      </View>
      {/* Confirmation Modal */}
      <ConfirmModal
        isVisible={isConfirmModalVisible}
        onClose={toggleConfirmModal}
        onConfirm={handleDeleteAccount}
        confirmTextColor="red"
        message="Are you sure you want to delete your account?"
        confirmTitle="Confirm Account Deletion"
      />
    </View>
  );
};

export default AccountInfo;
