import React from "react";
import { View, ScrollView, Text, Image } from "react-native";
import PastAuctionCard from "@/components/Pages/PastAuction/PastAuctionCard";

const PastAuctions = () => {
  // Mock data for past auctions
  const pastAuctions = [
    {
      id: 1,
      name: "Fine Jewels Auction",
      startTime: "2024-08-29T22:26:19.2129981",
      endTime: "2024-09-1T23:26:19.2129981",
      image: "https://thewatchclub.vn/wp-content/uploads/2022/05/4-1.jpg",
      status: "End Auctions",
      totalLots: 100,
      winner: "John Doe",
    },
    {
      id: 2,
      name: "Antique Art Auction",
      startTime: "2024-08-29T22:26:19.2129981",
      endTime: "2024-09-1T23:26:19.2129981",
      image: "https://thewatchclub.vn/wp-content/uploads/2022/05/4-1.jpg",
      status: "End Auctions",
      totalLots: 80,
      winner: "Jane Smith",
    },
    {
      id: 3,
      name: "Modern Paintings Auction",
      startTime: "2024-08-29T22:26:19.2129981",
      endTime: "2024-09-1T23:26:19.2129981",
      image: "https://thewatchclub.vn/wp-content/uploads/2022/05/4-1.jpg",
      status: "Live Auctions",
      totalLots: 120,
      winner: "Michael Johnson",
    },
  ];

  return (
    <ScrollView>
      <View className="p-4">
        {pastAuctions.map((auction) => (
          <PastAuctionCard
            key={auction.id}
            auctionTitle={auction.name}
            auctionStartTime={auction.startTime}
            auctionEndTime={auction.endTime}
            auctionWinner={auction.winner}
            auctionImage={auction.image}
            auctionStatus={auction.status}
            totalLots={auction.totalLots}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default PastAuctions;
