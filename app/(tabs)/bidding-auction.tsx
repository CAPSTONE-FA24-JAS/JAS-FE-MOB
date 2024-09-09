import React from "react";
import { Tab, Text, TabView } from "@rneui/themed";
import AuctionDetailScreen from "./auction-detail";
import AuctionLots from "./auction-lots";

export default () => {
  const [index, setIndex] = React.useState(0);

  return (
    <>
      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: "black",
          height: 3,
        }}
        variant="primary"
      >
        <Tab.Item title="AUCTION" titleStyle={{ fontSize: 12 }} />
        <Tab.Item title="LOTS" titleStyle={{ fontSize: 12 }} />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{ width: "100%" }}>
          <AuctionDetailScreen />
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <AuctionLots />
        </TabView.Item>
      </TabView>
    </>
  );
};
