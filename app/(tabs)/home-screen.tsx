import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import ItemAuctionHomePage from "@/components/ItemAuctionHomePage";
import ItemLots from "@/components/ItemLots";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <ScrollView>
      <View className="items-center flex-1">
        <ItemAuctionHomePage />
        <ItemAuctionHomePage />
        <ItemAuctionHomePage />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
