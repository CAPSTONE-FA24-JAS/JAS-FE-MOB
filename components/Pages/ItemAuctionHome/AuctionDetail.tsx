import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";

const AuctionDetailScreen = ({
  setIsSwiperActive,
}: {
  setIsSwiperActive: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <ScrollView className="bg-white">
      <View className="bg-red-600">
        <Text className="text-center text-white">Bid 13th 2min 56s Left</Text>
      </View>

      <View className="h-64">
        <Swiper
          showsPagination={true}
          autoplay={true}
          onIndexChanged={() => setIsSwiperActive(false)}
          onTouchStart={() => setIsSwiperActive(true)}
          onTouchEnd={() => setIsSwiperActive(false)}
          style={{ height: "100%" }}>
          <View>
            <Image
              source={require("../../../assets/bgItemAuction.png")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View>
            <Image
              source={require("../../../assets/bgItemAuction.png")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View>
            <Image
              source={require("../../../assets/bgItemAuction.png")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </Swiper>
      </View>

      <View className="p-4">
        <Text className="mb-2 text-xl font-bold">
          Designer Christopher's Evening Collection
        </Text>
        <Text className="mb-4 text-gray-600">
          Live Bidding Begins: 27 August 2024 @ 22:00
        </Text>
        <Text className="mb-4 text-gray-600">New York, NY</Text>
        <TouchableOpacity className="py-3 mb-3 bg-blue-500 rounded-sm">
          <Text className="font-semibold text-center text-white">
            VIEW LOTS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-3 bg-blue-500 rounded-sm">
          <Text className="font-semibold text-center text-white">
            REGISTER TO BID
          </Text>
        </TouchableOpacity>
        <Text className="mt-6 mb-2 font-bold">AUCTION DESCRIPTION</Text>
        <Text className="text-gray-700">
          Step Into An Evening Of Elegance And Sophistication As We Present
          Designer Christopher's Exclusive Evening Collection...
        </Text>
        <Text className="mt-6 mb-2 font-bold">LOCATION DESCRIPTION</Text>
        <Text className="text-gray-700">
          The auction will be held at the prestigious Grand Pavilion Hall,
          located in the heart of the city...
        </Text>
        <Text className="mt-6 mb-2 font-bold">VIEWING INFORMATION</Text>
        <Text className="text-gray-700">
          Interested buyers are invited to an exclusive viewing of the Designer
          Christopher's Evening Collection...
        </Text>
        <Text className="mt-6 mb-2 font-bold">Notes</Text>
        <Text className="text-gray-700">
          Bidders must register prior to the auction; registration will be
          available online and at the venue on the day...
        </Text>
      </View>
    </ScrollView>
  );
};

export default AuctionDetailScreen;
