import { viewAuctions } from "@/api/auctionApi";
import PastAuctionCard from "@/components/Pages/PastAuction/PastAuctionCard";
import React, { useEffect, useState, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuctionsData } from "../types/auction_type";

const PastAuctions = () => {
  const [auctions, setAuctions] = useState<AuctionsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchAuctions = async () => {
    try {
      const response = await viewAuctions();
      console.log("responsePastAuc", response);

      if (response?.isSuccess && Array.isArray(response?.data)) {
        const filteredAuctions = response.data.filter(
          (auction): auction is AuctionsData => {
            return (
              auction !== null &&
              typeof auction === "object" &&
              auction.status === "Past" &&
              typeof auction.id === "number" &&
              auction.startTime !== null &&
              auction.startTime !== undefined &&
              auction.endTime !== null &&
              auction.endTime !== undefined
            );
          }
        );
        setAuctions(filteredAuctions);
      } else {
        setError(response?.message || "No auctions found.");
      }
    } catch (err) {
      setError("Failed to load auctions.");
      console.error("Error fetching auctions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAuctions();
    setRefreshing(false);
  };

  // Sort auctions by most recent dates with null safety
  const sortedAuctions = useMemo(() => {
    return [...auctions].sort((a, b) => {
      // Safely parse dates with fallback to current date if invalid
      const getValidDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return new Date();
        const parsedDate = new Date(dateStr);
        return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
      };

      const aEndDate = getValidDate(a.endTime);
      const bEndDate = getValidDate(b.endTime);
      const aStartDate = getValidDate(a.startTime);
      const bStartDate = getValidDate(b.startTime);

      // First sort by end date (most recent first)
      const endDateComparison = bEndDate.getTime() - aEndDate.getTime();

      // If end dates are the same, sort by start date (most recent first)
      if (endDateComparison === 0) {
        return bStartDate.getTime() - aStartDate.getTime();
      }

      return endDateComparison;
    });
  }, [auctions]);

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
      <View className="items-center justify-center flex-1 bg-white">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity
          className="px-4 py-2 mt-4 bg-blue-500 rounded"
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchAuctions();
          }}>
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={sortedAuctions}
        keyExtractor={(auction) =>
          auction?.id?.toString() ?? Math.random().toString()
        }
        renderItem={({ item }) => (
          <PastAuctionCard
            key={item?.id}
            auctionId={item?.id ?? 0}
            auctionTitle={item?.name || "No Name"}
            auctionStartTime={item?.startTime ?? ""}
            auctionEndTime={item?.endTime ?? ""}
            auctionImage={item?.imageLink ?? ""}
            auctionStatus={item?.status ?? "Past"}
            totalLots={item?.totalLot ?? 0}
          />
        )}
        contentContainerStyle={{ padding: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center py-20">
            <Text className="font-semibold text-gray-500">
              No auctions available.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default PastAuctions;
