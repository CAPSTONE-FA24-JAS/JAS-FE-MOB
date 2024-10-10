import { Tab, TabView } from "@rneui/base";
import React from "react";
import PastBids from "@/components/Pages/MyBids/PastBids";
import CurrentBids from "@/components/Pages/MyBids/CurrentBids";

export default function MyBids() {
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
          title="Current"
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
        <TabView.Item className="m-2">
          <CurrentBids />
        </TabView.Item>
        <TabView.Item className="m-2">
          <PastBids />
        </TabView.Item>
      </TabView>
    </>
  );
}
