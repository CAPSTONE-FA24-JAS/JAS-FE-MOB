import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, FlatList, ScrollView } from "react-native";
import CountDownTimer from "./BidingComponent/CountDownTimer";
import ProductCard from "./BidingComponent/ProductCard";
import BidsList from "./BidingComponent/BidsList";
import BidInput from "./BidingComponent/BidInput";
import NavigationButtons from "./BidingComponent/NavigationButtons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Define the types for the route params
type RouteParams = {
  item: {
    id: number;
    name: string;
    minPrice?: number;
    maxPrice?: number;
    price?: number;
    image: string;
    typeBid: number;
  };
};

const RisingBidPage: React.FC = () => {
  // Retrieve the item from route params
  const route = useRoute();
  const { item } = route.params as RouteParams;

  // Mock data for bids
  const [bids, setBids] = useState([
    { time: "8:45:36 AM", user: "Your Bid", amount: 7250, highlight: true },
    { time: "8:44:36 AM", user: "Floor Bid", amount: 7000, highlight: false },
    { time: "8:44:36 AM", user: "Floor Bid", amount: 6800, highlight: false },
    { time: "8:44:36 AM", user: "Floor Bid", amount: 6700, highlight: false },
    { time: "8:44:36 AM", user: "Floor Bid", amount: 6700, highlight: false },
    { time: "8:44:36 AM", user: "Floor Bid", amount: 6700, highlight: false },
  ]);

  const highestBid = bids[0].amount;

  // Main content for FlatList rendering
  const mainContent = [
    {
      key: "note",
      component: (
        <View className="flex-row mx-2 mt-2 bg-black/50 rounded-md p-2">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={20}
            color="white"
          />
          {item.typeBid === 3 ? (
            <Text className="text-white font-medium text-sm text-center  mr-2 ">
              Bidding was successful! Latest and highest prices in the first
              row. Stay tuned...
            </Text>
          ) : (
            <Text className="text-white font-medium text-sm text-center  mr-2 ">
              This is Descending Bid Instructions! Whoever bids gets it. Stay
              tuned...
            </Text>
          )}
        </View>
      ),
    },
    { key: "timer", component: <CountDownTimer initialTime={10 * 60} /> },
    {
      key: "product",
      component: (
        <ProductCard
          id={item.id.toString()}
          name={item.name}
          image={item.image}
          typeBid={item.typeBid}
          minPrice={item.minPrice || 0}
          maxPrice={item.maxPrice || 0}
        />
      ),
    },
    { key: "bids", component: <BidsList bids={bids} item={item} /> },
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Scrollable content */}
      <FlatList
        data={mainContent}
        renderItem={({ item }) => (
          <View className="mb-2">{item.component}</View>
        )}
        keyExtractor={(item) => item.key}
        ListFooterComponent={() => <View style={{ height: 100 }} />} // Extra spacing at the bottom
      />

      {/* Fixed bottom content */}
      <View className="absolute bottom-0 left-0 right-0 bg-white shadow-lg">
        <BidInput highestBid={highestBid} item={item} />
        <NavigationButtons />
      </View>
    </View>
  );
};

export default RisingBidPage;
