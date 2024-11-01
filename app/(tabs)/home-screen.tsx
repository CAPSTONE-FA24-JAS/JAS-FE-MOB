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
import { MaterialIcons } from "@expo/vector-icons";

const HomeScreen = () => {
  const [auctions, setAuctions] = useState<AuctionsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const [status1Response, status2Response, status3Response] =
        await Promise.all([
          getAuctionsByStatus(3),
          getAuctionsByStatus(2),
          getAuctionsByStatus(1),
        ]);

      if (
        status1Response.isSuccess &&
        status2Response.isSuccess &&
        status3Response.isSuccess
      ) {
        const now = new Date();
        const combinedAuctions = [
          ...status1Response.data,
          ...status2Response.data,
          ...status3Response.data,
        ]
          // .filter((auction) => new Date(auction.endTime) > now)
          .sort((a, b) => b.id - a.id);

        setAuctions(combinedAuctions);
      } else {
        setError("Failed to load auctions.");
      }
    } catch (err) {
      setError("Failed to load auctions.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch auctions on component mount
  useEffect(() => {
    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Loading auctions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center flex-1">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity
          className="px-4 py-2 mt-4 bg-blue-500 rounded"
          onPress={() => {
            setLoading(true);
            setError(null);
            // Retry fetching auctions with statuses '1' and '2'
            Promise.all([
              getAuctionsByStatus(3),
              getAuctionsByStatus(2),
              getAuctionsByStatus(1),
            ])
              .then(([status1Response, status2Response, status3Response]) => {
                if (
                  status1Response.isSuccess &&
                  status2Response.isSuccess &&
                  status3Response.isSuccess
                ) {
                  const combinedAuctions = [
                    ...status1Response.data,
                    ...status2Response.data,
                    ...status3Response.data,
                  ]
                    // .filter((auction) => new Date(auction.endTime) > new Date())
                    .sort((a, b) => b.id - a.id);

                  setAuctions(combinedAuctions);
                } else {
                  setError("Failed to load auctions.");
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
      {/* Reload Button */}
      <View className="p-4 flex-row justify-end items-center">
        <TouchableOpacity
          onPress={fetchAuctions}
          className="flex-row items-center px-2 py-1 bg-gray-300 rounded"
        >
          <MaterialIcons name="refresh" size={24} color="black" />
          <Text className="ml-2 text-gray-700 font-semibold">Reload</Text>
        </TouchableOpacity>
      </View>
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
