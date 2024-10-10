import React from "react";
import { ScrollView } from "react-native";
import ItemCurrentBids from "./ItemCurrentBids";

const CurrentBids: React.FC = () => {
  // Dữ liệu giả cho các item với trạng thái live/coming soon
  const bidsData = [
    {
      id: 1,
      isLive: true,
      title: "Fine Jewels",
      lotNumber: "Lot #102",
      description: "Breitling Colt Chronograph in Steel",
      estimate: "US3500 - US4000",
      currentBid: "$3200",
      timeLeft: "2h 30m",
      endTime: "12 September 2024 22:00 GMT +7",
    },
    {
      id: 2,
      isLive: false,
      title: "Luxury Watches",
      lotNumber: "Lot #205",
      description: "Rolex Submariner in Gold",
      estimate: "US10000 - US12000",
      currentBid: "Not started",
      timeLeft: "Starts in 2d 5h",
      endTime: "15 September 2024 14:00 GMT +7",
    },
    {
      id: 3,
      isLive: true,
      title: "Rare Antiques",
      lotNumber: "Lot #330",
      description: "18th Century Vase",
      estimate: "US2000 - US2500",
      currentBid: "$2100",
      timeLeft: "45m",
      endTime: "12 September 2024 20:30 GMT +7",
    },
    {
      id: 4,
      isLive: false,
      title: "Modern Art",
      lotNumber: "Lot #410",
      description: "Abstract Painting by XYZ",
      estimate: "US15000 - US18000",
      currentBid: "Not started",
      timeLeft: "Starts in 5d 12h",
      endTime: "18 September 2024 10:00 GMT +7",
    },
  ];

  return (
    <ScrollView>
      {bidsData.map((item) => (
        <ItemCurrentBids
          key={item.id}
          id={item.id}
          isLive={item.isLive}
          title={item.title}
          lotNumber={item.lotNumber}
          description={item.description}
          estimate={item.estimate}
          currentBid={item.currentBid}
          timeLeft={item.timeLeft}
          endTime={item.endTime}
        />
      ))}
    </ScrollView>
  );
};

export default CurrentBids;
