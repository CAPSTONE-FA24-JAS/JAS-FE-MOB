import React, { useState } from "react";
import { View, TextInput, Image, TouchableOpacity, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome"; // Using FontAwesome for camera icon

type RouteParams = {
  userData: {
    userName: string;
    phoneNumber: string;
    email: string;
    profileImage: string;
    biddingLimit: number;
  };
};

const AccountInfo: React.FC = () => {
  const route = useRoute();
  const { userData } = route.params as RouteParams;

  // State to hold the editable data
  const [profile, setProfile] = useState({
    userName: userData.userName,
    phoneNumber: userData.phoneNumber,
    email: userData.email,
    biddingLimit: userData.biddingLimit.toString(),
    profileImage: userData.profileImage,
  });

  // Handle input change
  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  // Handle profile image change (You would trigger image picker here)
  const handleChangeProfileImage = () => {
    // Placeholder function for changing profile image
    console.log("Change profile image");
  };

  return (
    <View className="p-4 flex-1 bg-white">
      {/* Profile Image with Camera Icon */}
      <View className="mb-4 relative mx-auto">
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
        value={profile.userName}
        onChangeText={(value) => handleChange("userName", value)}
        placeholder="Enter your name"
        className="border-b border-gray-400 p-2 mb-4"
      />
      <TextInput
        value={profile.phoneNumber}
        onChangeText={(value) => handleChange("phoneNumber", value)}
        placeholder="Enter your phone number"
        className="border-b border-gray-400 p-2 mb-4"
      />
      <TextInput
        value={profile.email}
        onChangeText={(value) => handleChange("email", value)}
        placeholder="Enter your email"
        className="border-b border-gray-400 p-2 mb-4"
      />

      {/* Save Button */}
      <TouchableOpacity className="mt-4 p-3 bg-blue-500 rounded-lg">
        <Text className="text-white text-center text-lg uppercase font-semibold">
          Save Changes
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountInfo;
