import React from "react";
import { View, Text, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ProfileCardProps {
  userName: string;
  phoneNumber: string;
  email: string;
  profileImage: string;
  biddingLimit: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  userName,
  phoneNumber,
  email,
  profileImage,
  biddingLimit,
}) => {
  return (
    <View className="p-4 bg-white rounded-lg shadow-md mb-4">
      <View className="flex-row ">
        <Image
          source={{ uri: profileImage }}
          className="w-32 h-32 rounded-xl"
          resizeMode="cover"
        />
        <View className="ml-4 w-[60%]">
          <Text className="text-xl font-bold mb-1">{userName}</Text>
          <Text className="text-gray-500">{phoneNumber}</Text>
          <Text className="text-gray-500">{email}</Text>
          <View className=" w-full mt-2 bg-[#DDDDDD] p-2 rounded-md ">
            <Text className="text-gray-600  w-full text-center text-sm">
              Your Approved Bidding Limit:
            </Text>
            <Text className="text-gray-800 text-center w-full text-lg font-semibold">
              {biddingLimit
                ? biddingLimit.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                : 0 + " VND"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;
