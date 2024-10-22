import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import ItemAuctionHomePage from "@/components/Pages/ItemAuctionHome/ItemAuctionHomePage";
import { AuctionsData } from "../types/auction_type";
import { getAuctionsByStatus, viewAuctions } from "@/api/auctionApi";

const HomeScreen = () => {
  const [auctions, setAuctions] = useState<AuctionsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch auctions with status 'Living' on component mount
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await getAuctionsByStatus(2);
        if (response.isSuccess) {
          const now = new Date();
          const filteredAuctions = response.data
            .filter(
              (auction) => new Date(auction.endTime) > now // Ensure endTime is in the future
            )
            .sort((a, b) => b.id - a.id); // Sort by id in descending order

          setAuctions(filteredAuctions);
        } else {
          setError(response.message || "Failed to load auctions.");
        }
      } catch (err) {
        setError("Failed to load auctions.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Loading auctions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-blue-500 rounded"
          onPress={() => {
            setLoading(true);
            setError(null);
            // Retry fetching auctions
            getAuctionsByStatus(2)
              .then((response) => {
                if (response.isSuccess) {
                  const filteredAuctions = response.data.filter(
                    (auction) => new Date(auction.endTime) > new Date()
                  );
                  setAuctions(filteredAuctions);
                } else {
                  setError(response.message || "Failed to load auctions.");
                }
              })
              .catch(() => {
                setError("Failed to load auctions.");
              })
              .finally(() => setLoading(false));
          }}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // console.log("auctionsNe", auctions);

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={auctions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ItemAuctionHomePage auction={item} />}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Text className="text-gray-500">No auctions available.</Text>
          </View>
        }
      />
    </View>
  );
};

export default HomeScreen;
