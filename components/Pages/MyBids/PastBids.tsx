import React from "react";
import { View, Text, ScrollView } from "react-native";
import ItemPastBids from "./ItemPastBids";

const PastBids: React.FC = () => {
  // Dữ liệu giả cho các item với trạng thái win/loose
  const bidsData = [
    {
      id: 1,
      isWin: true,
      title: "Fine Jewels",
      lotNumber: "Lot #102",
      description: "Breitling Colt Chronograph in Steel",
      estimate: "US3500 - US4000",
      soldPrice: "$3200",
      maxBid: "$3200",
      status: "pending",
    },
    {
      id: 2,
      isWin: true,
      title: "Luxury Watches",
      lotNumber: "Lot #205",
      description: "Rolex Submariner in Gold",
      estimate: "US10000 - US12000",
      soldPrice: "$10500",
      maxBid: "$10000",
      status: "shipping",
    },
    {
      id: 3,
      isWin: true,
      title: "Rare Antiques",
      lotNumber: "Lot #330",
      description: "18th Century Vase",
      estimate: "US2000 - US2500",
      soldPrice: "$2400",
      maxBid: "$2400",
      status: "payment",
    },
    {
      id: 4,
      isWin: true,
      title: "Modern Art",
      lotNumber: "Lot #410",
      description: "Abstract Painting by XYZ",
      estimate: "US15000 - US18000",
      soldPrice: "$17000",
      maxBid: "$16000",
      status: "pending",
    },
  ];

  return (
    <ScrollView>
      {bidsData.map((item) => (
        <ItemPastBids
          key={item.id}
          id={item.id}
          isWin={item.isWin}
          title={item.title}
          lotNumber={item.lotNumber}
          description={item.description}
          estimate={item.estimate}
          soldPrice={item.soldPrice}
          maxBid={item.maxBid}
          status={item.status}
        />
      ))}
    </ScrollView>
  );
};

export default PastBids;
