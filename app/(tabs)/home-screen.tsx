import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import ItemLots from "@/components/ItemLots";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemAuctionHomePage from "@/components/Pages/ItemAuctionHome/ItemAuctionHomePage";
import PreValuationDetailsModal from "@/components/Modal/PreValuationDetailsModal";
import FinalValuationDetailsModal from "@/components/Modal/FinalValuationDetailsModal";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

// const HomeScreen = () => {
//   const router = useRouter();

//   return (
//     <ScrollView>
//       <View className="items-center flex-1 py-3">
//         <ItemAuctionHomePage />
//         <ItemAuctionHomePage />
//         <ItemAuctionHomePage />
//       </View>
//     </ScrollView>
//   );
// };

// export default HomeScreen;

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

  // Fake data for PreValuationDetailsModal
  const preValuationDetails = {
    images: [
      "https://locphuc.com.vn/Content/Images/072023/DFH0109BRW.WG01A/nhan-kim-cuong-DFH0109BRW-WG01A-g1.jpg",
      "https://locphuc.com.vn/Content/Images/072023/DFH0109BRW.WG01A/nhan-kim-cuong-DFH0109BRW-WG01A-g1.jpg",
      "https://locphuc.com.vn/Content/Images/072023/DFH0109BRW.WG01A/nhan-kim-cuong-DFH0109BRW-WG01A-g1.jpg",
      "https://locphuc.com.vn/Content/Images/072023/DFH0109BRW.WG01A/nhan-kim-cuong-DFH0109BRW-WG01A-g1.jpg",
    ],
    name: "Old Painting",
    owner: "Jane Doe",
    artist: "Unknown",
    category: "Paintings",
    weight: "1.5 kg",
    height: "50 cm",
    depth: "5 cm",
    description: "A 19th-century painting with visible wear.",
    estimatedCost: 2000,
    note: "Preliminary pricing is considered based on the images and dimensions you provide. Once you accept the preliminary valuation, please submit the product for final product valuation",
  };

  return (
    <ScrollView>
      <View className="items-center flex-1 py-3">
        <ItemAuctionHomePage />
        <ItemAuctionHomePage />
        <ItemAuctionHomePage />

        {/* Button to open PreValuationDetailsModal */}
        <TouchableOpacity
          className="bg-green-500 py-3 px-8 rounded-lg"
          onPress={() => setPreModalVisible(true)}
        >
          <Text className="text-white font-bold">Show Pre Valuation Modal</Text>
        </TouchableOpacity>
        {/* Button to open FinalValuationDetailsModal */}
        <TouchableOpacity
          className="bg-blue-500 py-3 px-8 mt-4 rounded-lg"
          onPress={() => setFinalModalVisible(true)}
        >
          <Text className="text-white font-bold">
            Show Final Valuation Modal
          </Text>
        </TouchableOpacity>
      </View>

      {/* PreValuationDetailsModal */}
      <PreValuationDetailsModal
        isVisible={isPreModalVisible}
        onClose={() => setPreModalVisible(false)}
        details={preValuationDetails}
        onApprove={() => showSuccessMessage("Approved")}
        onReject={() => showErrorMessage("Rejected")}
      />

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
