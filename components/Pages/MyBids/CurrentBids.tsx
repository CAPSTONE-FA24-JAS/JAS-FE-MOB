import React from "react";
import { View, Text, ScrollView } from "react-native";
import ItemCurrentBids from "../ItemCurrentBids";

const CurrentBids: React.FC = () => {
  return (
    <ScrollView className="">
      <ItemCurrentBids isLive={true} />
      <ItemCurrentBids isLive={false} />
      <ItemCurrentBids isLive={true} />
      <ItemCurrentBids isLive={false} />
    </ScrollView>
  );
};

export default CurrentBids;
