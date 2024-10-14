import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ItemAuctionHomePage from "@/components/Pages/ItemAuctionHome/ItemAuctionHomePage";
import FinalValuationDetailsModal from "@/components/Modal/FinalValuationDetailsModal";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { AuctionsData } from "../types/auction_type";
import { viewAuctions } from "@/api/auctionApi";

const HomeScreen = () => {
  const [isFinalModalVisible, setFinalModalVisible] = useState(false);
  const [isPreModalVisible, setPreModalVisible] = useState(false);

  const [auctions, setAuctions] = useState<AuctionsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch auctions on component mount
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await viewAuctions();
        if (response.isSuccess) {
          // Filter auctions with status "NotStarted" or "Living"
          const filteredAuctions = response.data.filter(
            (auction) =>
              auction.status === "NotStarted" || auction.status === "Living"
          );
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
            viewAuctions()
              .then((response) => {
                if (response.isSuccess) {
                  const filteredAuctions = response.data.filter(
                    (auction) =>
                      auction.status === "NotStarted" ||
                      auction.status === "Living"
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

  // Fake data for FinalValuationDetailsModal
  const finalValuationDetails = {
    images: [
      "https://locphuc.com.vn/Content/Images/072023/DFH0109BRW.WG01A/nhan-kim-cuong-DFH0109BRW-WG01A-g1.jpg",
      "https://locphuc.com.vn/Content/Images/072023/DFH0109BRW.WG01A/nhan-kim-cuong-DFH0109BRW-WG01A-g1.jpg",
      "https://locphuc.com.vn/Content/Images/072023/DFH0109BRW.WG01A/nhan-kim-cuong-DFH0109BRW-WG01A-g1.jpg",
      "https://locphuc.com.vn/Content/Images/072023/DFH0109BRW.WG01A/nhan-kim-cuong-DFH0109BRW-WG01A-g1.jpg",
    ],
    name: "Antique Vase",
    owner: "John Doe",
    artist: "Unknown",
    category: "Decorative Arts",
    weight: "2 kg",
    height: "30 cm",
    depth: "10 cm",
    description: {
      Metal: "Bronze",
      Gemstone: "None",
      Measurements: "30x10x10 cm",
    },
    estimatedCost: 1500,
    note: "If the customer accepts the above valuation, please sign the document attached below.",
    authorizationLetter: "https://example.com/authorization-letter.pdf",
  };

  // console.log("auctionsNe", auctions);

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={auctions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ItemAuctionHomePage auction={item} />}
        contentContainerStyle={{ padding: 10 }}
        ListHeaderComponent={
          <View className="items-center flex-1 py-3">
            {/* You can add other components here if needed */}
            {/* Button to open FinalValuationDetailsModal */}
            <TouchableOpacity
              className="px-8 py-3 mt-4 bg-blue-500 rounded-lg"
              onPress={() => setFinalModalVisible(true)}
            >
              <Text className="font-bold text-white">
                Show Final Valuation Modal
              </Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center py-20">
            <Text className="text-gray-500">No auctions available.</Text>
          </View>
        }
      />

      {/* FinalValuationDetailsModal */}
      {/* <FinalValuationDetailsModal
        isVisible={isFinalModalVisible}
        onClose={() => setFinalModalVisible(false)}
        details={finalValuationDetails}
        onApprove={() => {
          showSuccessMessage("Approved");
          setFinalModalVisible(false);
        }}
        onReject={() => {
          showErrorMessage("Rejected");
          setFinalModalVisible(false);
        }}
      /> */}
    </View>
  );
};

export default HomeScreen;
