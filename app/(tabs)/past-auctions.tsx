import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import PastAuctionCard from "@/components/Pages/PastAuction/PastAuctionCard";
import { viewAuctions } from "@/api/auctionApi";
import { AuctionsData } from "../types/auction_type";

const PastAuctions = () => {
  const [auctions, setAuctions] = useState<AuctionsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch auctions on component mount
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await viewAuctions();
        console.log("responsePastAuc", response);

        if (response.isSuccess && response.data) {
          // Filter auctions with status "Past"
          const filteredAuctions = response.data.filter(
            (auction) => auction.status === "Past"
          );
          setAuctions(filteredAuctions);
        } else {
          // Handle cases where response.data is null
          setError(response.message || "No auctions found.");
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
      <View className="flex-1 justify-center bg-white items-center">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-blue-500 rounded"
          onPress={() => {
            setLoading(true);
            setError(null);
            viewAuctions()
              .then((response) => {
                if (response.isSuccess && response.data) {
                  const filteredAuctions = response.data.filter(
                    (auction) => auction.status === "Past"
                  );
                  setAuctions(filteredAuctions);
                } else {
                  setError(response.message || "No auctions found.");
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

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={auctions}
        keyExtractor={(auction) => auction.id.toString()}
        renderItem={({ item }) => (
          <PastAuctionCard
            key={item.id}
            auctionId={item.id}
            auctionTitle={item.name || "No Name"}
            auctionStartTime={item.startTime}
            auctionEndTime={item.endTime}
            auctionImage={item.imageLink}
            auctionStatus={item.status}
            totalLots={item.totalLot}
          />
        )}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Text className="text-gray-500 font-semibold">
              No auctions available.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default PastAuctions;
