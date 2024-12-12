import { viewAuctions } from "@/api/auctionApi";
import PastAuctionCard from "@/components/Pages/PastAuction/PastAuctionCard";
import React, { useEffect, useState } from "react";
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
  const [refreshing, setRefreshing] = useState<boolean>(false); // Thêm trạng thái làm mới

  // Hàm gọi API để lấy danh sách đấu giá
  const fetchAuctions = async () => {
    try {
      const response = await viewAuctions();
      console.log("responsePastAuc", response);

      if (response.isSuccess && response.data) {
        // Lọc các đấu giá với trạng thái "Past"
        const filteredAuctions = response.data.filter(
          (auction) => auction.status === "Past"
        );
        setAuctions(filteredAuctions);
      } else {
        setError(response.message || "No auctions found.");
      }
    } catch (err) {
      setError("Failed to load auctions.");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchAuctions();
  }, []);

  // Hàm làm mới khi kéo để tải lại
  const handleRefresh = async () => {
    setRefreshing(true); // Bắt đầu trạng thái làm mới
    await fetchAuctions(); // Tải lại danh sách đấu giá
    setRefreshing(false); // Kết thúc làm mới
  };

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh} // Kéo để làm mới
          />
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
