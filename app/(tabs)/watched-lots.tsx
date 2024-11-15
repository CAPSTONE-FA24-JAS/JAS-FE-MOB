import { Tab, TabView } from "@rneui/base";
import React, { useEffect, useState } from "react";
import PastBids from "@/components/Pages/MyBids/PastBids";
import CurrentBids from "@/components/Pages/MyBids/CurrentBids";
import ItemWatchedCurrent from "@/components/ItemWatchedCurrernt";
import { WatchingData } from "../types/watching_type";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getAllWatchingsByCustomerId } from "@/api/watchingApi";
import { ActivityIndicator, Text } from "react-native";

export default function WatchedLots() {
  const [index, setIndex] = React.useState(0);
  const [watchings, setWatchings] = useState<WatchingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO?.id
  );

  // Separate watchings based on status
  const upcomingWatchings =
    Array.isArray(watchings) && watchings
      ? watchings.filter(
          (watch) => new Date(watch.jewelryDTO.time_Bidding) > new Date()
        )
      : [];
  const pastWatchings =
    Array.isArray(watchings) && watchings
      ? watchings.filter(
          (watch) => new Date(watch.jewelryDTO.time_Bidding) <= new Date()
        )
      : [];

  useEffect(() => {
    const fetchWatchings = async () => {
      if (userId) {
        setLoading(true);
        try {
          const response = await getAllWatchingsByCustomerId(userId);
          if (response.isSuccess) {
            setWatchings(response.data);
          }
        } catch (error) {
          console.error("Error fetching watchings:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWatchings();
  }, [userId]);

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
        }}>
        <Tab.Item
          title="Upcoming"
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
            width: "20%",
          })}
          buttonStyle={{
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        />
        <Tab.Item
          title="Past"
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
            width: "20%",
          })}
          buttonStyle={{
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item className="px-2">
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : upcomingWatchings.length > 0 ? (
            <ItemWatchedCurrent watching={upcomingWatchings} />
          ) : (
            <Text>No Past Watchings</Text>
          )}
        </TabView.Item>

        <TabView.Item style={{ width: "100%" }}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : pastWatchings.length > 0 ? (
            <ItemWatchedCurrent watching={pastWatchings} />
          ) : (
            <Text>No Past Watchings</Text>
          )}
        </TabView.Item>
      </TabView>
    </>
  );
}
