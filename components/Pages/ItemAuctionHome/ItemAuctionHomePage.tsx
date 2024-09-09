import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

// Define the types for navigation routes
type RootStackParamList = {
  BiddingAuction: undefined;
};

const ItemAuctionHomePage = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const router = useRouter();
  const goToAuctionDetail = () => {
    console.log("====================================");
    console.log("Go to auction detail page");
    console.log("====================================");
    navigation.navigate("BiddingAuction"); // Navigate back to Home

    // router.push("/(tabs)/bidding-auction"); // Path to your auction detail page
  };
  return (
    <TouchableOpacity className="w-[98%] py-1" onPress={goToAuctionDetail}>
      <Image
        className="w-[100%] h-[200px] rounded-lg relative"
        source={require("../../../assets/bgItemAuction.png")}
      />
      <View className="absolute top-28">
        <Text className="ml-4 text-lg font-bold text-white ">Fine Jewels</Text>
        <Text className="ml-4 text-sm font-bold text-white ">
          Live bidding begins: 12 September 2024 22:00 GMT +7
        </Text>
        <Text className="ml-4 text-sm font-bold text-white ">66 Lots</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemAuctionHomePage;
