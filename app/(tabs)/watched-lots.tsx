import { Tab, TabView } from "@rneui/base";
import React from "react";
import PastBids from "@/components/Pages/MyBids/PastBids";
import CurrentBids from "@/components/Pages/MyBids/CurrentBids";
import ItemWatchedCurrent from "@/components/ItemWatchedCurrernt";

export default function WatchedLots() {
  const [index, setIndex] = React.useState(0);
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
          <ItemWatchedCurrent />
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <ItemWatchedCurrent />
        </TabView.Item>
      </TabView>
    </>
  );
}
