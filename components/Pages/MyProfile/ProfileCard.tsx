import React from "react";
import { Image, Text, View } from "react-native";

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
    <View className="p-4 mb-4 bg-white rounded-lg shadow-md">
      <View className="flex-row ">
        <Image
          source={{ uri: profileImage }}
          className="w-32 h-32 rounded-xl"
          resizeMode="cover"
        />
        <View className="ml-4 w-[60%]">
          <Text className="mb-1 text-xl font-bold">{userName}</Text>
          <Text className="text-gray-500">{phoneNumber}</Text>
          <Text className="text-gray-500">{email}</Text>
          <View className=" w-full mt-2 bg-[#DDDDDD] p-2 rounded-md ">
            <Text className="w-full text-sm text-center text-gray-600">
              Your Approved Bidding Limit:
            </Text>
            <Text className="w-full text-lg font-semibold text-center text-gray-800">
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
