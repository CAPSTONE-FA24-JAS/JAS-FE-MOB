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
      soldPrice: 3200,
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
      soldPrice: 10500,
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
      soldPrice: 2400,
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
      soldPrice: 17000,
      maxBid: "$16000",
      status: "pending",
    },
  ];

  // State for filtering status
  const [selectedStatus, setSelectedStatus] = useState<number>(2);

  // Handle filtering logic
  // const filteredBids = bidsData.filter((item) => {
  //   if (selectedStatus === "all") {
  //     return true;
  //   }
  //   return item.status === selectedStatus;
  // });

  // CreateInvoice = 2,
  // Paid = 3,
  // PendingPayment = 4,
  // Delivering = 5,
  // Delivered =6,
  // Rejected = 7,
  // Finished = 8,
  // Refunded = 9,
  // Cancelled = 10,
  // Closed = 11
  return (
    <View className="flex-1 bg-white">
      {/* Horizontal Scrollable Status Tabs */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View className="flex-row gap-4 my-4">
          <TouchableOpacity onPress={() => setSelectedStatus(2)}>
            <Text
              className={`text-lg ${
                selectedStatus === 2
                  ? "text-gray-900 underline font-semibold"
                  : "text-gray-700"
              }`}
            >
              CreateInvoice
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedStatus(3)}>
            <Text
              className={`text-lg ${
                selectedStatus === 3
                  ? "text-gray-900 underline font-semibold"
                  : "text-gray-700"
              }`}
            >
              Paid
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedStatus(4)}>
            <Text
              className={`text-lg ${
                selectedStatus === 4
                  ? "text-gray-900 underline font-semibold"
                  : "text-gray-700"
              }`}
            >
              PendingPayment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedStatus(5)}>
            <Text
              className={`text-lg ${
                selectedStatus === 5
                  ? "text-gray-900 underline font-semibold"
                  : "text-gray-700"
              }`}
            >
              Delivering
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedStatus(6)}>
            <Text
              className={`text-lg ${
                selectedStatus === 6
                  ? "text-gray-900 underline font-semibold"
                  : "text-gray-700"
              }`}
            >
              Delivered
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedStatus(7)}>
            <Text
              className={`text-lg ${
                selectedStatus === 7
                  ? "text-gray-900 underline font-semibold"
                  : "text-gray-700"
              }`}
            >
              Rejected
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedStatus(8)}>
            <Text
              className={`text-lg ${
                selectedStatus === 8
                  ? "text-gray-900 underline font-semibold"
                  : "text-gray-700"
              }`}
            >
              Finished
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedStatus(9)}>
            <Text
              className={`text-lg ${
                selectedStatus === 9
                  ? "text-gray-900 underline font-semibold"
                  : "text-gray-700"
              }`}
            >
              Refunded
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedStatus(10)}>
            <Text
              className={`text-lg ${
                selectedStatus === 10
                  ? "text-gray-900 underline font-semibold"
                  : "text-gray-700"
              }`}
            >
              Cancelled
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedStatus(11)}>
            <Text
              className={`text-lg ${
                selectedStatus === 11
                  ? "text-gray-900 underline font-semibold"
                  : "text-gray-700"
              }`}
            >
              Closed
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Render List */}
      {/* <ScrollView>
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
      </ScrollView> */}
    </View>
  );
};

export default InvoiceList;
