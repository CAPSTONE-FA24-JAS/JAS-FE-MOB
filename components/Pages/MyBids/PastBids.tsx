import React from "react";
import { View, Text, ScrollView } from "react-native";
import ItemPastBids from "../ItemPastBids";

const PastBids: React.FC = () => {
  return (
    <ScrollView className="">
      <ItemPastBids isWin={true} />
      <ItemPastBids isWin={false} />
      <ItemPastBids isWin={true} />
      <ItemPastBids isWin={false} />
    </ScrollView>
  );
};

export default PastBids;
