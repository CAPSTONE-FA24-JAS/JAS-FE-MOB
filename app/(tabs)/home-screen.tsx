import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ItemAuctionHomePage from "@/components/Pages/ItemAuctionHome/ItemAuctionHomePage";
import FinalValuationDetailsModal from "@/components/Modal/FinalValuationDetailsModal";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

const HomeScreen = () => {
  const [isFinalModalVisible, setFinalModalVisible] = useState(false);
  const [isPreModalVisible, setPreModalVisible] = useState(false);

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

  return (
    <ScrollView>
      <View className="items-center flex-1 py-3">
        <ItemAuctionHomePage />
        <ItemAuctionHomePage />
        <ItemAuctionHomePage />

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

      {/* FinalValuationDetailsModal */}
      <FinalValuationDetailsModal
        isVisible={isFinalModalVisible}
        onClose={() => setFinalModalVisible(false)}
        details={finalValuationDetails}
        onApprove={() => showSuccessMessage("Approved")}
        onReject={() => showErrorMessage("Rejected")}
      />
    </ScrollView>
  );
};

export default HomeScreen;
