import React, { useState } from "react";
import { Tab, TabView } from "@rneui/themed";
import AuctionDetailScreen from "./AuctionDetail";
import AuctionLots from "./AuctionLots";

const BiddingAuction = () => {
  const [index, setIndex] = React.useState(0);
  const [isSwiperActive, setIsSwiperActive] = useState<boolean>(false);

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
          <AuctionDetailScreen setIsSwiperActive={setIsSwiperActive} />
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <AuctionLots />
        </TabView.Item>
      </TabView>
    </>
  );
};

export default BiddingAuction;
