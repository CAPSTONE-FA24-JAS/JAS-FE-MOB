import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import ItemPastBids from "@/components/Pages/MyBids/ItemPastBids";

const InvoiceList: React.FC = () => {
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

  // State for filtering status
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Handle filtering logic
  const filteredBids = bidsData.filter((item) => {
    if (selectedStatus === "all") {
      return true;
    }
    return item.status === selectedStatus;
  });

  return (
    <View className="flex-1 bg-white">
      {/* Status Tabs */}
      <View className="flex-row justify-around  my-4">
        <TouchableOpacity onPress={() => setSelectedStatus("all")}>
          <Text
            className={` text-lg ${
              selectedStatus === "all"
                ? "text-gray-900 underline font-semibold"
                : "text-gray-700"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedStatus("pending")}>
          <Text
            className={` text-lg ${
              selectedStatus === "pending"
                ? "text-gray-900 underline font-semibold"
                : "text-gray-700"
            }`}
          >
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedStatus("shipping")}>
          <Text
            className={` text-lg ${
              selectedStatus === "shipping"
                ? "text-gray-900 underline font-semibold"
                : "text-gray-700"
            }`}
          >
            Shipping
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedStatus("payment")}>
          <Text
            className={` text-lg ${
              selectedStatus === "payment"
                ? "text-gray-900 underline font-semibold"
                : "text-gray-700"
            }`}
          >
            Payment
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render List */}
      <ScrollView>
        {filteredBids.map((item) => (
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
    </View>
  );
};

export default InvoiceList;
