import React, { useEffect, useState } from "react";
import { Tab, TabView } from "@rneui/themed";
import AuctionDetailScreen from "./AuctionDetail";
import AuctionLots from "./AuctionLots";
import { useRoute } from "@react-navigation/native";
import { AuctionData } from "@/app/types/auction_type";
import { viewAuctionById } from "@/api/auctionApi";
import { ActivityIndicator, View, Text } from "react-native";

const BiddingAuction = () => {
  const route = useRoute();
  const auctionId = (route.params as { auctionId: number })?.auctionId;

  const [auctionDetails, setAuctionDetails] = useState<AuctionData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const [index, setIndex] = React.useState(0);
  const [isSwiperActive, setIsSwiperActive] = useState<boolean>(false);

  useEffect(() => {
    if (!auctionId) return;
    const fetchAuctionDetails = async () => {
      try {
        const response = await viewAuctionById(auctionId);
        setAuctionDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch auction details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [auctionId]);

  // Calculate time left
  useEffect(() => {
    if (!auctionDetails?.endTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(auctionDetails.endTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        let timeString = "";
        if (days > 0) timeString += `${days}d `;
        if (hours > 0) timeString += `${hours}h `;
        if (minutes > 0) timeString += `${minutes}m `;
        timeString += `${seconds}s Left`;

        setTimeLeft(timeString);
      } else {
        setTimeLeft("Auction ended");
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [auctionDetails?.endTime]);

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      {/* <View className="py-2 bg-red-600">
        <Text className="text-center text-white">
          {auctionDetails?.status === "Live" ? "Bid" : "Upcoming After"}
          {timeLeft}
        </Text>
      </View> */}

      <Tab
        dense
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: "transparent",
          height: 0,
        }}
        containerStyle={{
          backgroundColor: "transparent",
          alignSelf: "center",
          width: "50%",
        }}>
        <Tab.Item
          title="AUCTION"
          titleStyle={(active) => ({
            fontSize: 12,
            color: active ? "white" : "black",
          })}
          containerStyle={(active) => ({
            backgroundColor: active ? "black" : "transparent",
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            borderWidth: 1,
            borderColor: active ? "black" : "gray",
            width: "50%",
          })}
          buttonStyle={{
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        />
        <Tab.Item
          title="LOTS"
          titleStyle={(active) => ({
            fontSize: 12,
            color: active ? "white" : "black",
          })}
          containerStyle={(active) => ({
            backgroundColor: active ? "black" : "transparent",
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            borderWidth: 1,
            borderColor: active ? "black" : "gray",
            width: "50%",
          })}
          buttonStyle={{
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        />
      </Tab>

      <TabView
        value={index}
        onChange={setIndex}
        animationType="spring"
        disableSwipe={isSwiperActive}>
        <TabView.Item style={{ width: "100%" }}>
          {auctionDetails && (
            <AuctionDetailScreen
              setIsSwiperActive={setIsSwiperActive}
              dataAuction={auctionDetails}
            />
          )}
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          {auctionDetails && <AuctionLots dataAuction={auctionDetails} />}
        </TabView.Item>
      </TabView>
    </>
  );
};

export default BiddingAuction;
