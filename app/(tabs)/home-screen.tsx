import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import ItemAuctionHomePage from "@/components/Pages/ItemAuctionHome/ItemAuctionHomePage";
import { AuctionsData } from "../types/auction_type";
import { getAuctionsByStatus, viewAuctions } from "@/api/auctionApi";
import { MaterialIcons } from "@expo/vector-icons";
import * as signalR from "@microsoft/signalr"; // Import SignalR library
import { showSuccessMessage } from "@/components/FlashMessageHelpers";
import { useRouter } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";
const HOME_URL = `${API_URL}/notification`; // The SignalR hub URL

const HomeScreen = () => {
  const router = useRouter(); // Use useRouter for navigation

  const [auctions, setAuctions] = useState<AuctionsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [refreshing, setRefreshing] = useState<boolean>(false); // Trạng thái làm mới

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const [status1Response, status2Response] = await Promise.all([
        getAuctionsByStatus(3),
        getAuctionsByStatus(2),
        // getAuctionsByStatus(1),
      ]);

      if (
        status1Response.isSuccess &&
        status2Response.isSuccess
        // &&
        // status3Response.isSuccess
      ) {
        const now = new Date();
        const combinedAuctions = [
          ...status1Response.data,
          ...status2Response.data,
          // ...status3Response.data,
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

  // / Set up SignalR connection and event listeners
  useEffect(() => {
    // Create connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(HOME_URL)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop(); // Stop connection when component unmounts
      }
    };
  }, []);

  // Start the connection and listen for events
  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 3000;

    const startConnection = async () => {
      if (connection) {
        connection
          .start()
          .then(() => {
            console.log("Connected to SignalR");
            showSuccessMessage("Connected to SignalR");
            // Subscribe to SignalR events
            connection.on("AuctionHasBeenStarted", (auctionId) => {
              console.log("Auction started", auctionId);
              // Handle auction started event
              fetchAuctions(); // Reload auctions when one starts
            });

            connection.on("AuctionHasBeenEnd", (auctionId) => {
              console.log("Auction ended", auctionId);
              // Handle auction ended event
              fetchAuctions(); // Reload auctions when one ends
            });
          })
          .catch((error) => {
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              setTimeout(startConnection, RETRY_DELAY);
            } else {
              console.log("Max retries reached. Could not connect to SignalR.");
            }
          });
      }
    };

    startConnection();
    return () => {
      if (connection) {
        connection.stop(); // Stop connection when component unmounts
      }
    };
  }, [connection]);

  const handleRefresh = async () => {
    setRefreshing(true); // Kích hoạt trạng thái làm mới
    await fetchAuctions();
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
      <View className="items-center justify-center flex-1">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity
          className="px-4 py-2 mt-4 bg-blue-500 rounded"
          onPress={fetchAuctions}
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
      <View className="flex-row items-center justify-end p-4">
        <TouchableOpacity
          onPress={fetchAuctions}
          className="flex-row items-center px-2 py-1 bg-gray-300 rounded"
        >
          <MaterialIcons name="refresh" size={24} color="black" />
          <Text className="ml-2 font-semibold text-gray-700">Reload</Text>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh} // Gọi lại khi làm mới
          />
        }
      />

      {/* <View className="flex-row justify-around p-4">
        <TouchableOpacity
          className="bg-green-500 p-3 rounded w-[45%]"
          onPress={() => router.push("/result-payment?isSuccess=true")}
        >
          <Text className="text-white text-center font-bold">Success</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-500 p-3 rounded w-[45%]"
          onPress={() => router.push("/result-payment?isSuccess=false")}
        >
          <Text className="text-white text-center font-bold">Failure</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default HomeScreen;
