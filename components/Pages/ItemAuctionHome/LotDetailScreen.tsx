import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Divider } from "react-native-paper";
import Swiper from "react-native-swiper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import PlaceBidModal from "@/components/Modal/PlaceBidModal";

// Define the navigation param list type
type RootStackParamList = {
  PlaceBid: BidFormRouteParams;
  AutoBidSaveConfig: BidFormRouteParams;
  RisingBidPage: { item: any }; // Update this to expect `item` as a param
};

// Define the BidFormRouteParams type
export type BidFormRouteParams = {
  lotId: number;
  lotName: string;
  startBid: number;
  estimatedPrice: { min: number; max: number };
};

type RouteParams = {
  id: number;
  name: string;
  minPrice?: number;
  maxPrice?: number;
  price?: number;
  image: string;
  typeBid: number;
};

type LotDetailScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const LotDetailScreen = () => {
  const navigation = useNavigation<LotDetailScreenNavigationProp>();
  const data: BidFormRouteParams = {
    lotId: 101,
    lotName: "Lalaounis Chimera Chocker",
    startBid: 2600,
    estimatedPrice: { min: 3500, max: 4000 },
  };

  const route = useRoute();
  const { id, name, minPrice, maxPrice, price, image, typeBid } =
    route.params as RouteParams;

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const item = {
    id,
    image,
    name,
    minPrice: minPrice || 0,
    maxPrice: maxPrice || 0,
    price: price || 0,
    typeBid,
  };

  const handleSubmitBid = (bid: any) => {
    // Handle the bid submission
    console.log("Bid submitted:", bid);
    setModalVisible(false); // Close the modal after submission
    navigation.navigate("RisingBidPage", { item });
  };

  const handlePressAutoBid = () => {
    navigation.navigate("AutoBidSaveConfig", data);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView>
          <View className="py-2 bg-red-600">
            <Text className="text-center text-white">
              Bid 13th 2min 56s Left
            </Text>
          </View>
          <View className="h-64">
            <Swiper
              showsPagination={true}
              autoplay={true}
              style={{ height: "100%" }}
            >
              <Image
                source={require("../../../assets/item2.jpg")}
                className="w-full py-10 h-[200px]"
                resizeMode="contain"
              />
              <Image
                source={require("../../../assets/item2.jpg")}
                className="w-full py-10 h-[200px]"
                resizeMode="contain"
              />
            </Swiper>
          </View>
          <View className="flex-row p-4 justify-evenly">
            <Text className="font-bold text-gray-400">Share</Text>
            <Text className="font-bold text-gray-400">Follow</Text>
            <Text className="font-bold text-gray-400">Watch</Text>
          </View>
          <View className="p-4 space-y-2">
            <Text className=" text-base font-bold text-[#8f8f8f]">
              Lot #{id} - Hình Thức {typeBid}
            </Text>
            <Text className="text-base text-xl font-bold text-black">
              {name}
            </Text>
            {minPrice && maxPrice && (
              <View className="ml-4">
                <Text className=" text-base text-[#6c6c6c] ">
                  Est: ${minPrice} - ${maxPrice}
                </Text>
                <View className="flex-row gap-2 ">
                  <Text className="text-base font-bold text-[#6c6c6c] ">
                    Start Bid:
                  </Text>
                  <Text className="text-[#6c6c6c] text-base ">${minPrice}</Text>
                </View>
              </View>
            )}
            {price && (
              <View className="flex-row ">
                <Text className="text-base font-bold text-lg text-[#6c6c6c] ">
                  Price:
                </Text>
                <Text className="text-[#6c6c6c] ml-2 text-lg ">${price}</Text>
              </View>
            )}

            <Divider bold={true} />

            <Text className="mt-6 mb-2 font-bold">
              Summary of Key Characteristics
            </Text>
            <Text className="text-gray-700">
              Step Into An Evening Of Elegance And Sophistication As We Present
              Designer Christopher's Exclusive Evening Collection. This
              Carefully Curated Selection Showcases The Pinnacle Of Luxury
              Fashion And Exquisite Craftsmanship, From Stunning Evening Gowns
              To Exquisite Jewelry. Each Piece In This Collection Is A Testament
              To Christopher's Unique Design Philosophy, Combining Classic
              Elements With Modern Twists To Create Truly Unforgettable Looks
              That Have Graced The Most Celebrated Red Carpets In The High
              Fashion World.
            </Text>
            <Text className="mt-6 mb-2 font-bold">LOCATION DESCRIPTION</Text>
            <Text className="text-gray-700">
              The auction will be held at the prestigious Grand Pavilion Hall,
              located in the heart of the city. The Grand Pavilion is renowned
              for its opulent decor and state-of-the-art facilities, providing
              the perfect backdrop for this luxurious event. Attendees will
              enjoy a refined ambiance with ample seating, perfect lighting, and
              a comfortable environment to bid on these extraordinary items.
              Complimentary valet parking and refreshments will be provided.
            </Text>
            <Text className="mt-6 mb-2 font-bold">VIEWING INFORMATION</Text>
            <Text className="text-gray-700">
              Interested buyers are invited to an exclusive viewing of the
              Designer Christopher's Evening Collection on [insert date], from
              [insert time]. The viewing will take place at the Grand Pavilion
              Hall, where guests will have the opportunity to inspect the pieces
              up close. Our team of experts will be available to provide
              detailed information about each item and answer any questions.
              Please RSVP by [insert date] to secure your viewing appointment.
            </Text>
            <Text className="mt-6 mb-2 font-bold">Notes</Text>
            <Text className="text-gray-700">
              Bidders must register prior to the auction; registration will be
              available online and at the venue on the day of the event. All
              items are sold as-is; please inspect them thoroughly during the
              viewing period. A buyer's premium of [insert percentage] will be
              added to the final hammer price. Payment options include
              credit/debit cards, bank transfers, and certified checks. Please
              note that full payment is required within 24 hours of the
              auction's conclusion. Shipping arrangements can be made on-site,
              with insured delivery available to both domestic and international
              destinations.
            </Text>
          </View>
          <View className="h-32" />
        </ScrollView>
      </View>
      <View className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-white">
        {typeBid === 1 && (
          <TouchableOpacity className="py-3 mb-3 bg-blue-500 rounded-lg">
            <Text className="font-semibold text-center text-white">
              BUY IT NOW
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handlePressAutoBid}
          className="mb-3 bg-blue-500 rounded-sm"
        >
          <Text className="py-3 font-semibold text-center text-white">
            BID AUTOMATION
          </Text>
        </TouchableOpacity>
        {typeBid !== 1 && (
          <TouchableOpacity
            className="py-3 bg-blue-500 rounded-lg"
            onPress={() => setModalVisible(true)}
          >
            <Text className="font-semibold text-center text-white">
              PLACE BID
            </Text>
          </TouchableOpacity>
        )}

        {/* Place Bid Modal */}
        <PlaceBidModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          item={item}
          minPrice={item.minPrice}
          maxPrice={item.maxPrice}
          onSubmitBid={handleSubmitBid}
        />
      </View>
    </SafeAreaView>
  );
};

export default LotDetailScreen;
