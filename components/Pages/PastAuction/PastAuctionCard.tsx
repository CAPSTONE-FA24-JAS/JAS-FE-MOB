import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

interface PastAuctionCardProps {
  auctionTitle: string;
  auctionStartTime: string;
  auctionEndTime: string;
  auctionImage: string;
  auctionStatus: string;
  totalLots: number;
  auctionId: number;
}

type RootStackParamList = {
  BiddingAuction: { auctionId: number };
};

const PastAuctionCard: React.FC<PastAuctionCardProps> = ({
  auctionTitle,
  auctionImage,
  auctionStatus,
  auctionStartTime,
  auctionEndTime,
  totalLots,
  auctionId,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // Parse the auctionStartTime string into a Date object
  const auctionStartTimeObj = new Date(auctionStartTime);
  const auctionEndTimeObj = new Date(auctionEndTime);

  // Define arrays for days of the week and months
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthsOfYear = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  // Get formatted day, date, and month for auctionStartTime
  const startDayOfWeek = daysOfWeek[auctionStartTimeObj.getUTCDay()];
  const startDay = auctionStartTimeObj.getUTCDate();
  const startMonth = monthsOfYear[auctionStartTimeObj.getUTCMonth()];

  // Get formatted day, date, and month for auctionEndTime
  const endDayOfWeek = daysOfWeek[auctionEndTimeObj.getUTCDay()];
  const endDay = auctionEndTimeObj.getUTCDate();
  const endMonth = monthsOfYear[auctionEndTimeObj.getUTCMonth()];

  const goToAuctionDetail = () => {
    if (auctionId) {
      navigation.navigate("BiddingAuction", { auctionId: auctionId });
    }
  };

  return (
    <TouchableOpacity
      onPress={goToAuctionDetail}
      className="mb-4 p-2 bg-white border-2 border-gray-100 rounded-lg shadow-lg relative"
    >
      <View className="relative w-full ">
        <Image
          source={
            auctionImage?.startsWith("http")
              ? { uri: auctionImage }
              : require("../../../assets/bgItemAuction.png")
          }
          className="w-full h-52 "
          resizeMode="cover"
        />
        <Text className="text-xl font-bold mt-2 absolute bottom-0 text-white left-0 bg-[#0090ff8a] w-full p-2">
          {auctionTitle}
        </Text>
      </View>
      <View className="flex flex-row items-center justify-center mt-2 bg-[#ffffffad] w-1/3 absolute top-0 left-2">
        {/* Start Time */}
        <View className="w-[45%] mx-auto">
          <Text className="text-center text-base">{startDayOfWeek}</Text>
          <Text className="text-center text-2xl font-bold">{startDay}</Text>
          <Text className="text-center text-base font-semibold">
            {startMonth}
          </Text>
        </View>
        <Text className="text-xl w-[10%] font-bold">{">"}</Text>

        {/* End Time */}
        <View className="w-[45%] mx-auto">
          <Text className="text-center text-base">{endDayOfWeek}</Text>
          <Text className="text-center text-2xl font-bold">{endDay}</Text>
          <Text className="text-center text-base font-semibold">
            {endMonth}
          </Text>
        </View>
      </View>
      <View>
        <View className="flex flex-row items-center my-2 border-gray-200 border-b-2 pb-2">
          <MaterialCommunityIcons
            name="hammer"
            size={30}
            color="black"
            style={{ marginRight: 10 }}
          />
          <Text className=" w-full text-lg font-bold uppercase">
            {" "}
            {auctionStatus === "Past" ? "LIVE AUTION PAST" : "Other past"}
          </Text>
        </View>
        <View className="flex-row items-center justify-between my-1">
          <Text className="text-lg w-[90%] text-center font-semibold uppercase text-gray-600">
            {" "}
            {totalLots} LOTS
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color="gray"
            style={{ marginRight: 10 }}
            className=" w-fit float-right"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PastAuctionCard;
