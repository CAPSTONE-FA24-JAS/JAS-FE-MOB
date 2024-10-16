import React, { useEffect, useState } from "react";
import { Tab, TabView } from "@rneui/themed";
import AuctionDetailScreen from "./AuctionDetail";
import AuctionLots from "./AuctionLots";
import { useRoute } from "@react-navigation/native";
import { AuctionData } from "@/app/types/auction_type";
import { viewAuctionById } from "@/api/auctionApi";
import { ActivityIndicator, View } from "react-native";

const BiddingAuction = () => {
  const route = useRoute();
  const auctionId = (route.params as { auctionId: number })?.auctionId;

  const [auctionDetails, setAuctionDetails] = useState<AuctionData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
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
        }}
      >
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
        disableSwipe={isSwiperActive}
      >
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
